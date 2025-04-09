"""Perform basic checks on database to verify import success."""

import logging

import psycopg


logging.basicConfig(
    filename="dgidb_db_checks.log",
    format="[%(asctime)s] - %(name)s - %(levelname)s : %(message)s",
)
_logger = logging.getLogger(__package__)
_logger.setLevel(logging.INFO)

# figures from 2024-11-27 dump
expected_values = {
    "gene_claims": 81019,
    "gene_claim_attributes": 24484,
    "gene_claim_aliases": 454613,
    "drug_claims": 130616,
    "drug_claim_attributes": 10267,
    "drug_claim_aliases": 100000,
    "interaction_claims": 98920,
    "interaction_claim_attributes": 118673,
    "interaction_claim_types_interaction_claims": 35705,
    "interaction_claims_publications": 26670,
    "genes": 12062,
    "drugs": 39581,
    "interactions": 69907,
    "sources": 45,
    "gene_category_claims": 33066,
    "gene_categorizations": 20137,
    "drug_approval_ratings": 13332,
    "publications": 13142
}


def handle_warn(name, actual_value):
    """Just because a value drops below that of a previous release doesn't mean something's wrong;
    but it'd be good to know.
    """
    if expected_values[name] > actual_value:
        msg = f"WARNING: {name} value is {actual_value}, expected {expected_values[name]}"
        print(msg)
        _logger.info(msg)


def check_value(cur, name, query):
    cur.execute(query)
    value = cur.fetchone()[0]
    print(f"# {name}: {value}")
    handle_warn(name, value)

with psycopg.connect("dbname=dgidb user=postgres") as conn:
    with conn.cursor() as cur:
        check_value(cur, "gene_claims", "SELECT COUNT(*) FROM gene_claims;")
        check_value(cur, "gene_claim_attributes", "SELECT COUNT(*) FROM gene_claim_attributes;")
        check_value(cur, "gene_claim_aliases", "SELECT COUNT(*) FROM gene_claim_aliases;")
        check_value(cur, "drug_claims", "SELECT COUNT(*) FROM drug_claims;")
        check_value(cur, "drug_claim_attributes", "SELECT COUNT(*) FROM drug_claim_attributes;")
        check_value(cur, "drug_claim_aliases", "SELECT COUNT(*) FROM drug_claim_aliases;")
        check_value(cur, "interaction_claims", "SELECT COUNT(*) FROM interaction_claims;")
        check_value(cur, "interaction_claim_attributes", "SELECT COUNT(*) FROM interaction_claim_attributes;")
        check_value(cur, "interaction_claim_types_interaction_claims", "SELECT COUNT(*) FROM interaction_claim_types_interaction_claims;")
        check_value(cur, "interaction_claims_publications", "SELECT COUNT(*) FROM interaction_claims_publications;")

        check_value(cur, "genes", "SELECT COUNT(*) FROM genes;")
        check_value(cur, "drugs", "SELECT COUNT(*) FROM drugs;")
        check_value(cur, "interactions", "SELECT COUNT(*) FROM interactions;")

        check_value(cur, "sources", "SELECT COUNT(*) FROM sources;")

        check_value(cur, "gene_category_claims", "SELECT COUNT(*) FROM gene_claim_categories_gene_claims;")
        check_value(cur, "gene_categorizations", "SELECT COUNT(*) FROM gene_categories_genes;")

        check_value(cur, "drug_approval_ratings", "SELECT COUNT(*) FROM drug_approval_ratings;")
        check_value(cur, "publications", "SELECT COUNT(*) FROM publications;")
