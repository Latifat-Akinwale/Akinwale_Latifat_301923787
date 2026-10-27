# Portfolio 1 — Database Design and Modelling

I organised the data into analyst, incident, incident_event. The design document explains the fields, keys, relationships and business rules. The normalisation document shows the sample tables at 1NF, 2NF and 3NF.

## Database checks

| Table | Rows |
| --- | --- |
| analyst | 1 |
| incident | 1 |
| incident_event | 1 |

The 10 invalid inserts were rejected at their expected constraints, and the valid sample rows remained unchanged.

## Files

- [Design](Akinwale_Latifat_301923787_P1_Design.md)
- [ER diagram](Akinwale_Latifat_301923787_P1_ERDiagram.md)
- [Normalisation](Akinwale_Latifat_301923787_P1_Normalisation.md)
- [Schema](Akinwale_Latifat_301923787_P1_Schema.sql)
- [Sample data](Akinwale_Latifat_301923787_P1_SampleData.sql)
- [Constraint tests](Akinwale_Latifat_301923787_P1_ConstraintTests.sql)
- [Table and constraint evidence](screenshots/Akinwale_Latifat_301923787_P1_DatabaseResults.png)

## Run the SQL

Create a fresh PostgreSQL database. Run the schema first, then the sample data. Run the deliberately invalid statements in ConstraintTests.sql individually outside a transaction; each is expected to produce an error.

## References

- [PostgreSQL — constraints](https://www.postgresql.org/docs/17/ddl-constraints.html)

