# Database Schema

This directory contains the SQL schema for the Consult Vista application.

## `schema.sql`

This file contains the `CREATE TABLE` statements for all the tables in the database. It is designed for a MySQL database.

### How to Use

1.  Make sure you have a MySQL server running.
2.  Create a new database, ideally named `ConsultVista`.
3.  Run the `schema.sql` script against your new database to create all the necessary tables and relationships.

Example command:

```sh
mysql -u your_user -p ConsultVista < schema.sql
```

This will set up the empty relational structure required for the application's backend.
