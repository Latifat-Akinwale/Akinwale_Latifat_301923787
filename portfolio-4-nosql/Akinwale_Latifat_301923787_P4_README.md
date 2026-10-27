# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection incident_event_stream for incident_opened and status_changed events. These are fictional event examples based on incident_event, incident, analyst.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related incident, analyst details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "incident_opened",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "incident_event",
        "key": {
            "event_id": 301
        },
        "snapshot": {
            "event_id": 301,
            "incident_id": 201,
            "analyst_id": 101,
            "event_type": "triaged",
            "occurred_at": "2026-10-25T09:15:00Z",
            "details": "Synthetic alert reviewed and categorized."
        }
    },
    "embedded": {
        "incident": [
            {
                "key": {
                    "incident_id": 201
                },
                "snapshot": {
                    "incident_id": 201,
                    "owner_analyst_id": 101,
                    "title": "Synthetic access alert",
                    "category": "account_security",
                    "severity": 3,
                    "status": "investigating",
                    "opened_at": "2026-10-25T09:00:00Z",
                    "closed_at": null
                },
                "via": [
                    "incident_event.incident_id → incident"
                ]
            }
        ],
        "analyst": [
            {
                "key": {
                    "analyst_id": 101
                },
                "snapshot": {
                    "analyst_id": 101,
                    "display_name": "Amina Okafor",
                    "team": "Blue Response",
                    "active": true
                },
                "via": [
                    "incident_event.analyst_id → analyst",
                    "incident_event.incident_id → incident.owner_analyst_id → analyst"
                ]
            }
        ]
    },
    "references": {},
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 1 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 2 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("incident_event_stream").find({"eventType":"incident_opened"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "incident_opened",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "event_id": 301
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("incident_event_stream").find({"source.key.event_id":301}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "incident_opened",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "event_id": 301
    }
  },
  {
    "_id": "event_000002",
    "eventType": "status_changed",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "event_id": 301
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("incident_event_stream").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "incident_opened",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "event_id": 301
    }
  },
  {
    "_id": "event_000002",
    "eventType": "status_changed",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "event_id": 301
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("incident_event_stream").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| incident_opened | 1 |
| status_changed | 1 |

## Validation and suitability

MongoDB inserted 2 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 2 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run Akinwale_Latifat_301923787_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/Akinwale_Latifat_301923787_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

