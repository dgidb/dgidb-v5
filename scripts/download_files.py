import base64
import datetime
import logging
import os
import sys
import re
from typing import NamedTuple
import requests
from pathlib import Path
import boto3
from botocore.exceptions import ClientError
from wags_tails.base_source import DataSource, UnversionedDataSource, RemoteDataError
from wags_tails.utils.storage import get_latest_local_file
from wags_tails.utils.downloads import HTTPS_REQUEST_TIMEOUT, download_http, handle_zip
from wags_tails.utils.versioning import DATE_VERSION_PATTERN, parse_file_version

from tqdm import tqdm

_logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)


def download_s3(uri: str, outfile_path: Path, tqdm_params: dict | None = None) -> None:
    if not tqdm_params:
        tqdm_params = {}
    _logger.info("Downloading %s from %s...", outfile_path.name, uri)

    bucket, key = uri.removeprefix("s3://").split("/", 1)

    s3 = boto3.client("s3")
    try:
        response = s3.head_object(Bucket=bucket, Key=key)
    except ClientError as e:
        _logger.error("Encountered ClientError downloading %s: %s", uri, e.response)
        raise e

    file_size = response["ContentLength"]

    with tqdm(total=file_size, **tqdm_params) as progress_bar:
        s3.download_file(
            Bucket=bucket,
            Key=key,
            Filename=outfile_path,
            Callback=lambda bytes_amount: progress_bar.update(bytes_amount),
        )


class UnversionedS3Data(UnversionedDataSource):
    _datatype = "claims"
    _filetype = "tsv"  # most of this data is TSV, can manually set otherwise

    def _download_data(self, version: str, outfile: Path) -> None:
        download_s3(
            f"s3://nch-igm-wagner-lab/dgidb/source_data/{self._src_name}/{self._src_name}_{self._datatype}.{self._filetype}",
            outfile,
            self._tqdm_params,
        )

    def get_latest(
        self, from_local: bool = False, force_refresh: bool = False
    ) -> tuple[Path, str]:
        """Get path to data file

        :param from_local: if True, use latest available local file
        :param force_refresh: if True, fetch and return data from remote regardless of
            whether a local copy is present
        :return: Path to location of data, and version value of it
        :raise ValueError: if both ``force_refresh`` and ``from_local`` are True
        """
        if force_refresh and from_local:
            msg = "Cannot set both `force_refresh` and `from_local`"
            raise ValueError(msg)

        filename = f"{self._src_name}_{self._datatype}.{self._filetype}"
        if from_local:
            return get_latest_local_file(self.data_dir, filename), ""

        file_path = self.data_dir / filename
        if (not force_refresh) and file_path.exists():
            _logger.debug(
                "Found existing file, %s (unversioned).",
                file_path.name,
            )
            return file_path, ""
        self._download_data("", file_path)
        return file_path, ""


class BaderLab(UnversionedS3Data):
    _src_name = "bader_lab"


class CancerCommons(UnversionedS3Data):
    _src_name = "cancer_commons"


class Caris(UnversionedS3Data):
    _src_name = "caris_molecular_intelligence"


class Cgi(UnversionedS3Data):
    _src_name = "cgi"


class ClearityFoundationBiomarkers(UnversionedS3Data):
    _src_name = "clearity_foundation"
    _datatype = "biomarkers_claims"


class ClearityFoundationClinicalTrial(UnversionedS3Data):
    _src_name = "clearity_foundation"
    _datatype = "clinical_trial_claims"


class Cosmic(UnversionedS3Data):
    _src_name = "cosmic"
    _filetype = "csv"


class Dgene(UnversionedS3Data):
    _src_name = "dgene"


class DocmDrugClaims(UnversionedS3Data):
    _src_name = "docm"
    _datatype = "drug_claims"
    _filetype = "csv"


class DocmGeneClaims(UnversionedS3Data):
    _src_name = "docm"
    _datatype = "gene_claims"
    _filetype = "csv"


class DocmInteractionClaims(UnversionedS3Data):
    _src_name = "docm"
    _datatype = "interaction_claims"
    _filetype = "csv"


class DocmInteractionClaimAttributes(UnversionedS3Data):
    _src_name = "docm"
    _datatype = "interaction_claim_attributes"
    _filetype = "csv"


class DocmInteractionClaimPublications(UnversionedS3Data):
    _src_name = "docm"
    _datatype = "interaction_claim_publications"
    _filetype = "csv"


class DrugbankProtected(DataSource):
    _src_name = "drugbank"
    _filetype = "xml"

    @staticmethod
    def _get_latest_version() -> tuple[str, str]:
        releases_url = "https://go.drugbank.com/releases/latest.json"
        r = requests.get(releases_url, timeout=HTTPS_REQUEST_TIMEOUT)
        r.raise_for_status()
        try:
            data = r.json()
            for release in data:
                if release["url"].endswith("all-full-database"):
                    version = (
                        re.match(
                            r"https:\/\/go.drugbank.com\/releases\/(.*)\/downloads\/all-full-database",
                            release["url"],
                        )
                        .groups()[0]
                        .replace("-", ".")
                    )
                    return version, release["url"]
            msg = f"Unable to parse release data for full DB from {releases_url}"
            raise RemoteDataError(msg)
        except (KeyError, IndexError) as e:
            msg = "Unable to parse latest DrugBank version number from releases API endpoint"
            raise RemoteDataError(msg) from e

    def _get_latest_local_file(self, glob: str) -> tuple[Path, str]:
        """Get most recent locally-available file. DrugBank uses versioning that isn't
        easily sortable by default so we have to use some extra magic.
        """
        _logger.debug("Getting local match against pattern %s...", glob)
        file_version_pairs = []
        for file in self.data_dir.glob(glob):
            version = parse_file_version(file, r"drugbank_([\d\.]+).csv")
            formatted_version = [int(digits) for digits in version.split(".")]
            file_version_pairs.append((file, version, formatted_version))
        files = sorted(file_version_pairs, key=lambda p: p[2])
        if not files:
            msg = "No source data found for DrugBank"
            raise FileNotFoundError(msg)
        latest = files[-1]
        _logger.debug("Returning %s as most recent locally-available file.", latest[0])
        return latest[0], latest[1]

    def _download_data(self, url: str, outfile: Path) -> None:
        email = os.environ.get("DRUGBANK_EMAIL")
        password = os.environ.get("DRUGBANK_PASSWORD")
        if not (email and password):
            msg = "Unable to download DrugBank dataset -- must provide email and password under env vars DRUGBANK_EMAIL and DRUGBANK_PASSWORD"
            raise RemoteDataError(msg)

        encoded_credentials = base64.b64encode(
            f"{email}:{password}".encode("utf-8")
        ).decode("utf-8")
        headers = {"Authorization": f"Basic {encoded_credentials}"}
        download_http(
            url,
            outfile,
            handler=handle_zip,
            tqdm_params=self._tqdm_params,
            headers=headers,
        )

    def get_latest(
        self, from_local: bool = False, force_refresh: bool = False
    ) -> tuple[Path, str]:
        """Get path to latest version of data, and its version value

        :param from_local: if True, use latest available local file
        :param force_refresh: if True, fetch and return data from remote regardless of
            whether a local copy is present
        :return: Path to location of data, and version value of it
        :raise ValueError: if both ``force_refresh`` and ``from_local`` are True
        """
        if force_refresh and from_local:
            msg = "Cannot set both `force_refresh` and `from_local`"
            raise ValueError(msg)

        if from_local:
            file_path, version = self._get_latest_local_file("drugbank_*.xml")
            return file_path, version

        latest_version, latest_url = self._get_latest_version()
        latest_file = self.data_dir / f"drugbank_{latest_version}.xml"
        if (not force_refresh) and latest_file.exists():
            _logger.debug(
                "Found existing file, %s, matching latest version %s.",
                latest_file.name,
                latest_version,
            )
            return latest_file, latest_version
        self._download_data(latest_url, latest_file)
        return latest_file, latest_version


class Dtc(UnversionedS3Data):
    _src_name = "dtc"
    _filetype = "csv"


class Fda(UnversionedS3Data):
    _src_name = "fda"


class FoundationOneGenes(UnversionedS3Data):
    _src_name = "foundation_one_genes"


class GtoPPaths(NamedTuple):
    """Container for GuideToPharmacology file paths."""

    interactions: Path
    targets_and_families: Path


class GToPInteractionData(DataSource):
    """Provide access to Guide to Pharmacology data."""

    _src_name = "guidetopharmacology"
    _filetype = "tsv"

    @staticmethod
    def _get_latest_version() -> str:
        r = requests.get(
            "https://www.guidetopharmacology.org/", timeout=HTTPS_REQUEST_TIMEOUT
        )
        r.raise_for_status()
        r_text = r.text.split("\n")
        pattern = re.compile(r"Current Release Version (\d{4}\.\d) \(.*\)")
        for line in r_text:
            if "Current Release Version" in line:
                matches = re.findall(pattern, line.strip())
                if matches:
                    return matches[0]
        else:
            msg = "Unable to parse latest Guide to Pharmacology version number homepage HTML."
            raise RemoteDataError(msg)

    def _download_data(self, file_paths: GtoPPaths) -> None:
        download_http(
            "https://www.guidetopharmacology.org/DATA/interactions.tsv",
            file_paths.interactions,
            tqdm_params=self._tqdm_params,
        )
        download_http(
            "https://www.guidetopharmacology.org/DATA/targets_and_families.tsv",
            file_paths.targets_and_families,
            tqdm_params=self._tqdm_params,
        )

    def get_latest(
        self, from_local: bool = False, force_refresh: bool = False
    ) -> tuple[GtoPPaths, str]:
        """Get path to latest version of data, and its version value

        :param from_local: if True, use latest available local file
        :param force_refresh: if True, fetch and return data from remote regardless of
            whether a local copy is present
        :return: Paths to data, and version value of it
        :raise ValueError: if both ``force_refresh`` and ``from_local`` are True
        """
        if force_refresh and from_local:
            msg = "Cannot set both `force_refresh` and `from_local`"
            raise ValueError(msg)

        if from_local:
            interactions_path = get_latest_local_file(
                self.data_dir, "gtop_interactions_*.tsv"
            )
            targets_and_families_path = get_latest_local_file(
                self.data_dir, "gtop_targets_and_families_*.tsv"
            )
            file_paths = GtoPPaths(
                interactions=interactions_path,
                targets_and_families=targets_and_families_path,
            )
            return file_paths, parse_file_version(
                interactions_path, r"gtop_interactions_(\d{4}\.\d+).tsv"
            )

        latest_version = self._get_latest_version()
        interactions_path = self.data_dir / f"gtop_interactions_{latest_version}.tsv"
        targets_and_families_path = (
            self.data_dir / f"gtop_targets_and_families_{latest_version}.tsv"
        )
        file_paths = GtoPPaths(
            interactions=interactions_path,
            targets_and_families=targets_and_families_path,
        )
        if not force_refresh:
            if interactions_path.exists() and targets_and_families_path.exists():
                _logger.debug(
                    "Found existing files, %s, matching latest version %s.",
                    file_paths,
                    latest_version,
                )
                return file_paths, latest_version
            if interactions_path.exists() or targets_and_families_path.exists():
                _logger.warning(
                    "Existing files, %s, not all available -- attempting full download.",
                    file_paths,
                )
        self._download_data(file_paths)
        return file_paths, latest_version


class HingoraniCasas(UnversionedS3Data):
    _src_name = "hingorani_casas"


class HopkinsGroom(UnversionedS3Data):
    _src_name = "hopkins_groom"


class HumanProteinAtlas(UnversionedS3Data):
    _src_name = "human_protein_atlas"


class Idg(UnversionedS3Data):
    _src_name = "idg"
    _filetype = "json"


class MskImpact(UnversionedS3Data):
    _src_name = "msk_impact"


class MyCancerGenome(UnversionedS3Data):
    _src_name = "my_cancer_genome"


class MyCancerGenomeClinicalTrial(UnversionedS3Data):
    _src_name = "my_cancer_genome"
    _datatype = "clinical_trial_claims"


class Nci(UnversionedS3Data):
    _src_name = "nci"


class PharmGkbRelations(DataSource):
    _src_name = "pharmgkb"
    _filetype = "tsv"

    @staticmethod
    def _get_latest_version() -> str:
        return (
            datetime.datetime.now()
            .replace(tzinfo=datetime.UTC)
            .strftime(DATE_VERSION_PATTERN)
        )

    def _download_data(self, version: str, outfile: Path) -> None:
        download_http(
            "https://api.pharmgkb.org/v1/download/file/data/relationships.zip",
            outfile,
            handler=handle_zip,
            tqdm_params=self._tqdm_params,
        )


class OncoKbDrugClaims(UnversionedS3Data):
    _src_name = "oncokb"
    _datatype = "drug_claims"
    _filetype = "csv"


class OncoKbGeneClaims(UnversionedS3Data):
    _src_name = "oncokb"
    _datatype = "gene_claims"
    _filetype = "csv"


class OncoKbGeneClaimAliases(UnversionedS3Data):
    _src_name = "oncokb"
    _datatype = "gene_claim_aliases"
    _filetype = "csv"


class OncoKbInteractionClaims(UnversionedS3Data):
    _src_name = "oncokb"
    _datatype = "interaction_claims"
    _filetype = "csv"


class OncoKbInteractionClaimLinks(UnversionedS3Data):
    _src_name = "oncokb"
    _datatype = "interaction_claim_links"
    _filetype = "csv"


class OncoKbInteractionClaimAttributes(UnversionedS3Data):
    _src_name = "oncokb"
    _datatype = "interaction_claim_attributes"
    _filetype = "csv"


class Oncomine(UnversionedS3Data):
    _src_name = "oncomine"


class RussLampel(UnversionedS3Data):
    _src_name = "russ_lampel"


class Talc(UnversionedS3Data):
    _src_name = "talc"


class Tdg(UnversionedS3Data):
    _src_name = "tdg_clinical_trial"


class Tempus(UnversionedS3Data):
    _src_name = "tempus"


class Tend(UnversionedS3Data):
    _src_name = "tend"


class Ttd(UnversionedS3Data):
    _src_name = "ttd"
    _filetype = "csv"


for SourceClass in [
    BaderLab,
    CancerCommons,
    Caris,
    Cgi,
    ClearityFoundationBiomarkers,
    ClearityFoundationClinicalTrial,
    Cosmic,
    Dgene,
    DocmDrugClaims,
    DocmGeneClaims,
    DocmInteractionClaims,
    DocmInteractionClaimAttributes,
    DocmInteractionClaimPublications,
    DrugbankProtected,
    Dtc,
    Fda,
    FoundationOneGenes,
    GToPInteractionData,
    HingoraniCasas,
    HopkinsGroom,
    HumanProteinAtlas,
    Idg,
    MskImpact,
    MyCancerGenome,
    MyCancerGenomeClinicalTrial,
    Nci,
    OncoKbDrugClaims,
    OncoKbGeneClaims,
    OncoKbGeneClaimAliases,
    OncoKbInteractionClaims,
    OncoKbInteractionClaimLinks,
    OncoKbInteractionClaimAttributes,
    Oncomine,
    PharmGkbRelations,
    RussLampel,
    Talc,
    Tdg,
    Tempus,
    Tend,
    Ttd,
]:
    try:
        SourceClass(silent=False).get_latest()
    except Exception as e:
        print(SourceClass)
        print(e)
