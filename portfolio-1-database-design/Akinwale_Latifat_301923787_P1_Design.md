# SentinelNaija – Cybersecurity incident management — database design

My case study records analyst, incident, incident_event.

## Users

- Incident coordinators
- Response analysts
- Management reviewers

## Main operations

- Register incidents and assign an analyst
- Record timestamped response events
- Review incident status and summarize response activity

## Entities

| Entity | Information stored |
| --- | --- |
| analyst | Stores the synthetic responder identity and team used for incident ownership and event attribution. |
| incident | Stores incident details and references its assigned analyst. For the normalization exercise, keep analyst name and team in analyst and reference that row with owner_analyst_id. |
| incident_event | Stores a timestamped response event associated with an incident and the analyst who recorded it. |

## analyst

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| analyst_id | BIGINT | PK | Yes |
| display_name | TEXT |  | Yes |
| team | TEXT |  | Yes |
| active | BOOLEAN |  | Yes |


## incident

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| incident_id | BIGINT | PK | Yes |
| owner_analyst_id | BIGINT | FK | Yes |
| title | TEXT |  | Yes |
| category | TEXT |  | Yes |
| severity | INTEGER |  | Yes |
| status | TEXT |  | Yes |
| opened_at | TIMESTAMPTZ |  | Yes |
| closed_at | TIMESTAMPTZ |  | No |
- owner_analyst_id → analyst.analyst_id

## incident_event

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| event_id | BIGINT | PK | Yes |
| incident_id | BIGINT | FK | Yes |
| analyst_id | BIGINT | FK | Yes |
| event_type | TEXT |  | Yes |
| occurred_at | TIMESTAMPTZ |  | Yes |
| details | TEXT |  | Yes |
- incident_id → incident.incident_id
- analyst_id → analyst.analyst_id

## Relationships and business rules

- Every incident owner must reference an existing analyst.
- Incident severity must be an integer from 1 through 5.
- When closed_at is present, it must be no earlier than opened_at.
- Incident status must be open, investigating, contained, or closed.
- Every response event must reference an existing incident.

## Assumptions

- Severity is an integer from 1 through 5, with 5 the highest.
- Incident timestamps use UTC; closed_at is absent until an incident is closed.
- Each incident has one assigned analyst; each response event records one analyst.
- Incident status is one of open, investigating, contained, or closed.
- The incident entity is the normalization example: store owner_analyst_id as a foreign key rather than repeating the analyst's display name or team in each incident.

