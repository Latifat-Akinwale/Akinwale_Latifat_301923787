-- Fictional sample records for SentinelNaija – Cybersecurity incident management.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."analyst" ("analyst_id", "display_name", "team", "active") VALUES (101, 'Amina Okafor', 'Blue Response', TRUE);
INSERT INTO portfolio."incident" ("incident_id", "owner_analyst_id", "title", "category", "severity", "status", "opened_at", "closed_at") VALUES (201, 101, 'Synthetic access alert', 'account_security', 3, 'investigating', '2026-10-25T09:00:00Z', NULL);
INSERT INTO portfolio."incident_event" ("event_id", "incident_id", "analyst_id", "event_type", "occurred_at", "details") VALUES (301, 201, 101, 'triaged', '2026-10-25T09:15:00Z', 'Synthetic alert reviewed and categorized.');
COMMIT;
