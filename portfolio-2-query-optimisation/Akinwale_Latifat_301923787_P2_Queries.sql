-- Show related incident, analyst records (up to 20).
SELECT t0."incident_id" AS "incident_incident_id",
       t0."title" AS "incident_title",
       t1."analyst_id" AS "analyst_analyst_id",
       t1."display_name" AS "analyst_display_name"
FROM portfolio."incident" t0
JOIN portfolio."analyst" t1 ON t0."owner_analyst_id" = t1."analyst_id"
ORDER BY t0."incident_id", t1."analyst_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT t0."incident_id" AS "incident_incident_id",
       t0."title" AS "incident_title",
       t1."analyst_id" AS "analyst_analyst_id",
       t1."display_name" AS "analyst_display_name"
FROM portfolio."incident" t0
JOIN portfolio."analyst" t1 ON t0."owner_analyst_id" = t1."analyst_id"
ORDER BY t0."incident_id", t1."analyst_id"
LIMIT 20;

-- Find incident_event records where occurred_at matches "2026-10-25T09:15:00Z" (up to 20).
SELECT * FROM portfolio."incident_event"
WHERE "occurred_at" IS NOT DISTINCT FROM '2026-10-25T09:15:00Z'
ORDER BY "event_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."incident_event"
WHERE "occurred_at" IS NOT DISTINCT FROM '2026-10-25T09:15:00Z'
ORDER BY "event_id"
LIMIT 20;

-- Count incident_event records for each incident_id (up to 20 groups).
SELECT "incident_id", count(*) AS record_count
FROM portfolio."incident_event"
GROUP BY "incident_id"
ORDER BY record_count DESC, "incident_id" NULLS LAST
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT "incident_id", count(*) AS record_count
FROM portfolio."incident_event"
GROUP BY "incident_id"
ORDER BY record_count DESC, "incident_id" NULLS LAST
LIMIT 20;

-- Find incident_event records where occurred_at matches "2026-10-25T09:15:00Z" (up to 20).
SELECT * FROM portfolio."incident_event"
WHERE "occurred_at" IS NOT DISTINCT FROM '2026-10-25T09:15:00Z'
ORDER BY "event_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."incident_event"
WHERE "occurred_at" IS NOT DISTINCT FROM '2026-10-25T09:15:00Z'
ORDER BY "event_id"
LIMIT 20;
