# SentinelNaija – Cybersecurity incident management — ER diagram

```mermaid
erDiagram
    direction LR
    analyst {
        bigint analyst_id PK
        text display_name
        text team
        boolean active
    }
    incident {
        bigint incident_id PK
        bigint owner_analyst_id FK
        text title
        text category
        integer severity
        text status
        timestamptz opened_at
        timestamptz closed_at "Optional"
    }
    incident_event {
        bigint event_id PK
        bigint incident_id FK
        bigint analyst_id FK
        text event_type
        timestamptz occurred_at
        text details
    }
    analyst ||--o{ incident : "owner_analyst_id"
    incident ||--o{ incident_event : "incident_id"
    analyst ||--o{ incident_event : "analyst_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Akinwale_Latifat_301923787_ERDiagram.png)
