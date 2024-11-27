import psycopg

# figures from 2024-11-27 dump
expected_values = {
    "gene_claims": 81019,
    "genes": 12062,
    "drug_claims": 130616,
    "drugs": 39581,
    "interaction_claims": 98920,
    "interactions": 69907,
    "sources": 45,
    "gene_category_claims": 33066,
    "gene_categorizations": 20137,
    "drug_approval_ratings": 13332,
    "publications": 13142
}
def handle_warn(name, actual_value):
    if expected_values[name] > actual_value:
        print(f"WARNING: {name} value is {actual_value}, expected {expected_values[name]}")


def check_value(name, query):
    cur.execute(query)
    value = cur.fetchone()[0]
    print(f"# {name}: {value}")
    handle_warn(name, value)

with psycopg.connect("dbname=dgidb user=postgres") as conn:
    with conn.cursor() as cur:
        check_value("gene_claims", "SELECT COUNT(*) FROM gene_claims;")
        check_value("genes", "SELECT COUNT(*) FROM genes;")
        check_value("drug_claims", "SELECT COUNT(*) FROM drug_claims;")
        check_value("drugs", "SELECT COUNT(*) FROM drugs;")
        check_value("interaction_claims", "SELECT COUNT(*) FROM interaction_claims;")
        check_value("interactions", "SELECT COUNT(*) FROM interactions;")

        check_value("sources", "SELECT COUNT(*) FROM sources;")

        check_value("gene_category_claims", "SELECT COUNT(*) FROM gene_claim_categories_gene_claims;")
        check_value("gene_categorizations", "SELECT COUNT(*) FROM gene_categories_genes;")

        check_value("drug_approval_ratings", "SELECT COUNT(*) FROM drug_approval_ratings;")
        check_value("publications", "SELECT COUNT(*) FROM publications;")
