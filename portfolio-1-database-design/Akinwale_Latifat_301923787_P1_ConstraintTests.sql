-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. duplicate analyst pk. Expected: pk_analyst, SQLSTATE 23505.
INSERT INTO portfolio."analyst" ("analyst_id", "display_name", "team", "active")
VALUES (101, 'Synthetic Duplicate', 'Blue Response', TRUE);

-- 2. duplicate incident pk. Expected: pk_incident, SQLSTATE 23505.
INSERT INTO portfolio."incident" ("incident_id", "owner_analyst_id", "title", "category", "severity", "status", "opened_at", "closed_at")
VALUES (201, 101, 'Synthetic duplicate incident', 'account_security', 2, 'open', '2026-10-26T09:00:00Z', NULL);

-- 3. duplicate event pk. Expected: pk_incident_event, SQLSTATE 23505.
INSERT INTO portfolio."incident_event" ("event_id", "incident_id", "analyst_id", "event_type", "occurred_at", "details")
VALUES (301, 201, 101, 'triaged', '2026-10-25T10:00:00Z', 'Synthetic duplicate event.');

-- 4. missing incident owner. Expected: fk_incident_0, SQLSTATE 23503.
INSERT INTO portfolio."incident" ("incident_id", "owner_analyst_id", "title", "category", "severity", "status", "opened_at", "closed_at")
VALUES (401, 991, 'Synthetic incident with unknown owner', 'account_security', 2, 'open', '2026-10-26T09:00:00Z', NULL);

-- 5. missing event incident. Expected: fk_incident_event_0, SQLSTATE 23503.
INSERT INTO portfolio."incident_event" ("event_id", "incident_id", "analyst_id", "event_type", "occurred_at", "details")
VALUES (402, 992, 101, 'triaged', '2026-10-26T09:15:00Z', 'Synthetic event references an unknown incident.');

-- 6. missing event analyst. Expected: fk_incident_event_1, SQLSTATE 23503.
INSERT INTO portfolio."incident_event" ("event_id", "incident_id", "analyst_id", "event_type", "occurred_at", "details")
VALUES (403, 201, 993, 'triaged', '2026-10-26T09:20:00Z', 'Synthetic event references an unknown analyst.');

-- 7. severity out of range. Expected: incident_severity_range, SQLSTATE 23514.
INSERT INTO portfolio."incident" ("incident_id", "owner_analyst_id", "title", "category", "severity", "status", "opened_at", "closed_at")
VALUES (404, 101, 'Synthetic severity check', 'account_security', 6, 'open', '2026-10-26T10:00:00Z', NULL);

-- 8. closed before opened. Expected: incident_time_order, SQLSTATE 23514.
INSERT INTO portfolio."incident" ("incident_id", "owner_analyst_id", "title", "category", "severity", "status", "opened_at", "closed_at")
VALUES (405, 101, 'Synthetic time-order check', 'account_security', 2, 'closed', '2026-10-26T12:00:00Z', '2026-10-26T11:00:00Z');

-- 9. invalid incident status. Expected: incident_status_values, SQLSTATE 23514.
INSERT INTO portfolio."incident" ("incident_id", "owner_analyst_id", "title", "category", "severity", "status", "opened_at", "closed_at")
VALUES (406, 101, 'Synthetic status check', 'account_security', 2, 'resolved', '2026-10-26T13:00:00Z', NULL);

-- 10. null analyst name. Expected: display_name, SQLSTATE 23502.
INSERT INTO portfolio."analyst" ("analyst_id", "display_name", "team", "active")
VALUES (407, NULL, 'Blue Response', TRUE);
