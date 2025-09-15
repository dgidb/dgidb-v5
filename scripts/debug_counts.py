"""Get specific value readouts for counts of particular features/breakdowns."""

import logging

import psycopg

logging.basicConfig(
    filename="dgidb_db_debugging.log",
    format="[%(asctime)s] - %(name)s - %(levelname)s : %(message)s",
)
_logger = logging.getLogger(__package__)
_logger.setLevel(logging.INFO)


def get_pmids_by_source(cur):
    _logger.info("-------")
    _logger.info("Getting PMID counts by source:")
    query = "SELECT s.source_db_name, COUNT(*) FROM interaction_claims_publications icp LEFT JOIN interaction_claims ic ON ic.id = icp.interaction_claim_id LEFT JOIN sources s ON s.id = ic.source_id GROUP BY s.source_db_name ORDER BY s.source_db_name;"
    cur.execute(query)
    for source, count in cur.fetchall():
        _logger.info("Source: %s, Value: %s", source, count)


def get_interaction_claims_by_source(cur):
    _logger.info("------")
    _logger.info("Getting interaction claim counts by source:")
    query = "SELECT s.source_db_name, COUNT(*) FROM interaction_claims ic LEFT JOIN sources s on s.id = ic.source_id group by s.source_db_name order by s.source_db_name;"
    cur.execute(query)
    for source, count in cur.fetchall():
        _logger.info("Source: %s, Value: %s", source, count)


def get_drug_claims_by_source(cur):
    _logger.info("------")
    _logger.info("Getting drug claim counts by source:")
    query = "SELECT s.source_db_name, COUNT(*) FROM drug_claims dc LEFT JOIN sources s on s.id = dc.source_id GROUP BY s.source_db_name ORDER BY s.source_db_name;"
    cur.execute(query)
    for source, count in cur.fetchall():
        _logger.info("Source: %s, Value: %s", source, count)


if __name__ == "__main__":
    with psycopg.connect("dbname=dgidb user=postgres") as conn:
        with conn.cursor() as cur:
            get_pmids_by_source(cur)
            get_interaction_claims_by_source(cur)
            get_drug_claims_by_source(cur)
