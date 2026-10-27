// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("incident_event_stream")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("incident_event_stream", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "incident_opened",
                    "status_changed"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "incident_event"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "event_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("incident_event_stream").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "status_changed",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "incident_event",
                    "key": {
                        "event_id": 301
                    },
                    "field": "details",
                    "value": "Synthetic alert reviewed and categorized."
                }
            ],
            "examples": {
                "context": "illustrative context"
            }
        }
    }
]));
  await db.getCollection("incident_event_stream").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("incident_event_stream").find({"eventType":"incident_opened"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("incident_event_stream").find({"source.key.event_id":301}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("incident_event_stream").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("incident_event_stream").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("incident_event_stream").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("incident_event_stream").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("incident_event_stream").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
