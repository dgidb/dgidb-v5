<h1 align="center">DGIdb v5</h1>

A from-scratch rewrite of the [Drug-Gene Interaction Database](https://dgidb.org/).

## For developers

### Initial dependencies

First, make sure you have all of the following installed:

- [RVM](https://rvm.io/rvm/install#any-other-system) -- choose the stable version
- PostgreSQL, either from [here](https://wiki.postgresql.org/wiki/Homebrew) or [here](http://postgresapp.com)
- [NPM/Node](https://nodejs.org/en/download/)

Clone and enter the repository:

```shell
git clone https://github.com/dgidb/dgidb-v5
cd dgidb-v5
```

### Server setup

First, you may need to switch your Ruby version with RVM to match the version declared in the first few lines of the [Gemfile](server/Gemfile). For example, to switch to version 3.0.4:

```shell
rvm install 3.0.4
rvm 3.0.4
```

From the repo root, enter the [server subdirectory](server/):

```shell
cd server
```

If RVM is properly installed, you should expect to encounter a warning message here:

```
RVM used your Gemfile for selecting Ruby, it is all fine - Heroku does that too,
you can ignore these warnings with 'rvm rvmrc warning ignore ./Gemfile'.
To ignore the warning for all files run 'rvm rvmrc warning ignore allGemfiles'.
```

Next, install Rails and other required gems with `bundle`:

```shell
bundle install
```

The server will need a running Postgres instance. Postgres start commands may vary based on your OS and processor type. The following should work on M1 Macs:

```shell
pg_ctl -D /opt/homebrew/var/postgres start
# on older macs you may need to use a different path instead, eg "pg_ctl -D /usr/local/var/postgres start"
```

Database initialization utilities are in-progress, so for now, the easiest way to get a working database is to manually create it using the `psql` command. First, enter the psql console:

```
psql -d postgres  # if you are opening psql for the first time, you'll need to connect to the database 'postgres'
# should produce a prompt like the following:
# psql (14.2)
# Type "help" for help.
#
# jss009=#
```

Within the psql console, create the DGIdb database, then quit:

```
CREATE DATABASE dgidb;
\q
```

Next, back in the main shell, import a database dump file (ask on Slack if you need the latest file):

```shell
psql -d dgidb -f dgidb_dump_20220526.psql  # provide path to data dump
```

That should take a few minutes. Finally, start the Rails server:

```shell
rails s
```

Navigate to `localhost:3000/api/graphiql` in your browser. If the example query provided runs successfully, then you're all set.

### Data loading

To perform a data load from scratch, first run the `reset` task to provide a clean, seeded DB:

```shell
rake db:reset
```

Most DGIdb data comes from static files, typically called `claims.tsv`. The data loader classes expect `server/lib/data/` to contain the following files:

```
lib/data
├── bader_lab
│   └── claims.tsv
├── cancer_commons
│   └── claims.tsv
├── caris_molecular_intelligence
│   └── claims.tsv
├── cgi
│   └── claims.tsv
├── chembl
│   └── chembl.db
├── clearity_foundation_biomarkers
│   └── claims.tsv
├── clearity_foundation_clinical_trial
│   └── claims.tsv
├── cosmic
│   └── claims.csv
├── dgene
│   └── claims.tsv
├── drugbank
│   └── claims.xml
├── dtc
│   └── claims.csv
├── ensembl
│   └── claims.tsv
├── entrez
│   └── claims.tsv
├── fda
│   └── claims.tsv
├── foundation_one_genes
│   └── claims.tsv
├── go
│   └── targets.tsv
├── guide_to_pharmacology
│   ├── interactions.csv
│   └── targets_and_families.csv
├── hingorani_casas
│   └── claims.tsv
├── hopkins_groom
│   └── claims.tsv
├── human_protein_atlas
│   └── claims.tsv
├── idg
│   ├── claims.json
│   └── claims.tsv
├── msk_impact
│   └── claims.tsv
├── my_cancer_genome
│   └── claims.tsv
├── my_cancer_genome_clinical_trial
│   └── claims.tsv
├── nci
│   ├── claims.tsv
│   └── claims.xml
├── oncokb
│   ├── drug_claim.csv
│   ├── gene_claim.csv
│   ├── gene_claim_aliases.csv
│   ├── interaction_claim.csv
│   ├── interaction_claim_attributes.csv
│   └── interaction_claim_links.csv
├── oncomine
│   └── claims.tsv
├── pharmgkb
│   └── claims.tsv
├── russ_lampel
│   └── claims.tsv
├── talc
│   └── claims.tsv
├── tdg_clinical_trial
│   ├── claims.tsv
├── tempus
│   └── claims.tsv
├── tend
│   └── claims.tsv
└── ttd
    └── claims.csv
```

First, load claims:

```shell
rake dgidb:import:all
```

Then, run grouping. By default, the groupers will expect a normalizer service to be running locally on port 8000; use the `THERAPY_HOSTNAME` and `GENE_HOSTNAME` environment variables to specify alternate hosts:

```shell
export THERAPY_HOSTNAME=http://localhost:7999  # no trailing backslash
rake dgidb:group:drugs
export GENE_HOSTNAME=http://localhost:7998  # no trailing backslash
rake dgidb:group:genes
rake dgidb:group:interactions
```

Finally, normalize remaining metadata:

```shell
rake dgidb:normalize:drug_approval_types
rake dgidb:normalize:drug_types
rake dgidb:normalize:populate_source_counters
```

### Client setup

Navigate to the [/client directory](/client):

```shell
# from dgidb-v5 root
cd client
```

Install dependencies with yarn:

```shell
yarn install
```

Start the client:

```shell
yarn start
```

Frontend style is enforced by [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). Conformance is ensured by [pre-commit](https://pre-commit.com/#usage). Before your first commit, run

```shell
pre-commit install
```

In practice, Prettier will do most of the formatting work for you to be in accordance with ESLint. Run the following to autoformat a file:

```shell
yarn run prettier --write path/to/file
```
