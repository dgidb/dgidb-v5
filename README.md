<h1>DGIdb v5</h1>

# For developers

## Getting started

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

You may need to switch your Ruby version with RVM to match the version declared in the first few lines of the [Gemfile](server/Gemfile). For example, to switch to version 3.0.4:

```shell
rvm install 3.0.4
rvm 3.0.4
```

Next, install Rails and other required gems with `bundle`:

```shell
bundle install
```

The server will need a running Postgres instance. Postgres start commands may vary based on your OS and processor type. The following should work on M1 Macs:

```shell
pg_ctl -D /opt/homebrew/var/postgres start
```

Database initialization utilities are in-progress, so for now, the easiest way to get a working database is to manually create it using the `psql` command. First, enter the psql console:

```
psql
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
psql -d dgidb -f dgidb_dump_20220526.sql  # provide path to data dump
```

Finally, start the Rails server:

```shell
rails s
```

Navigate to `localhost:3000/api/graphiql` in your browser. If the example query provided runs successfully, then you're all set.

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
