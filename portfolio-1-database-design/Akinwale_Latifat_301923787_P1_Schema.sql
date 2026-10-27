-- SentinelNaija – Cybersecurity incident management: tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."analyst" (
  "analyst_id" bigint NOT NULL,
  "display_name" text NOT NULL,
  "team" text NOT NULL,
  "active" boolean NOT NULL,
  CONSTRAINT "pk_analyst" PRIMARY KEY ("analyst_id")
);
CREATE TABLE portfolio."incident" (
  "incident_id" bigint NOT NULL,
  "owner_analyst_id" bigint NOT NULL,
  "title" text NOT NULL,
  "category" text NOT NULL,
  "severity" bigint NOT NULL,
  "status" text NOT NULL,
  "opened_at" timestamptz NOT NULL,
  "closed_at" timestamptz,
  CONSTRAINT "pk_incident" PRIMARY KEY ("incident_id")
);
CREATE TABLE portfolio."incident_event" (
  "event_id" bigint NOT NULL,
  "incident_id" bigint NOT NULL,
  "analyst_id" bigint NOT NULL,
  "event_type" text NOT NULL,
  "occurred_at" timestamptz NOT NULL,
  "details" text NOT NULL,
  CONSTRAINT "pk_incident_event" PRIMARY KEY ("event_id")
);
ALTER TABLE portfolio."incident" ADD CONSTRAINT "fk_incident_0" FOREIGN KEY ("owner_analyst_id") REFERENCES portfolio."analyst" ("analyst_id");
ALTER TABLE portfolio."incident_event" ADD CONSTRAINT "fk_incident_event_0" FOREIGN KEY ("incident_id") REFERENCES portfolio."incident" ("incident_id");
ALTER TABLE portfolio."incident_event" ADD CONSTRAINT "fk_incident_event_1" FOREIGN KEY ("analyst_id") REFERENCES portfolio."analyst" ("analyst_id");
ALTER TABLE portfolio."incident" ADD CONSTRAINT "incident_severity_range" CHECK (("severity" >= 1) AND ("severity" <= 5));
ALTER TABLE portfolio."incident" ADD CONSTRAINT "incident_time_order" CHECK (("closed_at" IS NULL) OR ("closed_at" > "opened_at"));
ALTER TABLE portfolio."incident" ADD CONSTRAINT "incident_status_values" CHECK (("status" = 'open') OR ("status" = 'investigating') OR ("status" = 'contained') OR ("status" = 'closed'));
COMMIT;
