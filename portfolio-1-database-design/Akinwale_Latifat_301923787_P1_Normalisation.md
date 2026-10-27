# SentinelNaija – Cybersecurity incident management — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| owner_analyst_id | incident records (list) |
| --- | --- |
| 101 | [201] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| incident.incident_id | incident.owner_analyst_id | incident.title | analyst.analyst_id | analyst.display_name |
| --- | --- | --- | --- | --- |
| 201 | 101 | Synthetic access alert | 101 | Amina Okafor |

Key: incident_id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## incident_example

| incident.incident_id | incident.owner_analyst_id | incident.title | analyst.analyst_id | analyst.display_name |
| --- | --- | --- | --- | --- |
| 201 | 101 | Synthetic access alert | 101 | Amina Okafor |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## analyst

| analyst_id | display_name | team | active |
| --- | --- | --- | --- |
| 101 | Amina Okafor | Blue Response | true |

## incident

| incident_id | owner_analyst_id | title | category | severity | status | opened_at | closed_at |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 201 | 101 | Synthetic access alert | account_security | 3 | investigating | 2026-10-25T09:00:00+00:00 | NULL |

## incident_event

| event_id | incident_id | analyst_id | event_type | occurred_at | details |
| --- | --- | --- | --- | --- | --- |
| 301 | 201 | 101 | triaged | 2026-10-25T09:15:00+00:00 | Synthetic alert reviewed and categorized. |

## Dependencies

- analyst: (analyst_id) → display_name, team, active
- incident: (incident_id) → owner_analyst_id, title, category, severity, status, opened_at, closed_at
- incident_event: (event_id) → incident_id, analyst_id, event_type, occurred_at, details

Joining the decomposed sample tables reproduces the original 1 example rows. The design assumes the declared keys describe the relevant business dependencies.
