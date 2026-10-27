# SentinelNaija – Cybersecurity incident management — SQL queries

## 1. Show related incident, analyst records (up to 20).

```sql
SELECT t0."incident_id" AS "incident_incident_id",
       t0."title" AS "incident_title",
       t1."analyst_id" AS "analyst_analyst_id",
       t1."display_name" AS "analyst_display_name"
FROM portfolio."incident" t0
JOIN portfolio."analyst" t1 ON t0."owner_analyst_id" = t1."analyst_id"
ORDER BY t0."incident_id", t1."analyst_id"
LIMIT 20;
```

| incident_incident_id | incident_title | analyst_analyst_id | analyst_display_name |
| --- | --- | --- | --- |
| 201 | Synthetic access alert | 101 | Amina Okafor |

## 2. Find incident_event records where occurred_at matches "2026-10-25T09:15:00Z" (up to 20).

```sql
SELECT * FROM portfolio."incident_event"
WHERE "occurred_at" IS NOT DISTINCT FROM '2026-10-25T09:15:00Z'
ORDER BY "event_id"
LIMIT 20;
```

| event_id | incident_id | analyst_id | event_type | occurred_at | details |
| --- | --- | --- | --- | --- | --- |
| 301 | 201 | 101 | triaged | 2026-10-25T09:15:00+00:00 | Synthetic alert reviewed and categorized. |

## 3. Count incident_event records for each incident_id (up to 20 groups).

```sql
SELECT "incident_id", count(*) AS record_count
FROM portfolio."incident_event"
GROUP BY "incident_id"
ORDER BY record_count DESC, "incident_id" NULLS LAST
LIMIT 20;
```

| incident_id | record_count |
| --- | --- |
| 201 | 1 |

## 4. Find incident_event records where occurred_at matches "2026-10-25T09:15:00Z" (up to 20).

```sql
SELECT * FROM portfolio."incident_event"
WHERE "occurred_at" IS NOT DISTINCT FROM '2026-10-25T09:15:00Z'
ORDER BY "event_id"
LIMIT 20;
```

| event_id | incident_id | analyst_id | event_type | occurred_at | details |
| --- | --- | --- | --- | --- | --- |
| 301 | 201 | 101 | triaged | 2026-10-25T09:15:00+00:00 | Synthetic alert reviewed and categorized. |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 2.369 | 2.944, 2.368, 2.369 | Sort → Seq Scan | 274 |
| After index | 0.251 | 0.251, 0.375, 0.249 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 55 |

The median execution time changed from 2.369 ms to 0.251 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=2.91..2.912 rows=50 loops=1)
  Seq Scan on incident_event (actual time=0.024..2.861 rows=50 loops=1)
Planning Time: 0.444 ms
Execution Time: 2.944 ms
```

### Before index, run 2

```text
Sort (actual time=2.308..2.311 rows=50 loops=1)
  Seq Scan on incident_event (actual time=0.017..2.267 rows=50 loops=1)
Planning Time: 0.338 ms
Execution Time: 2.368 ms
```

### Before index, run 3

```text
Sort (actual time=2.338..2.34 rows=50 loops=1)
  Seq Scan on incident_event (actual time=0.016..2.273 rows=50 loops=1)
Planning Time: 0.343 ms
Execution Time: 2.369 ms
```

### After index, run 1

```text
Sort (actual time=0.194..0.196 rows=50 loops=1)
  Bitmap Heap Scan on incident_event (actual time=0.032..0.155 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.014 rows=50 loops=1)
Planning Time: 0.59 ms
Execution Time: 0.251 ms
```

### After index, run 2

```text
Sort (actual time=0.281..0.284 rows=50 loops=1)
  Bitmap Heap Scan on incident_event (actual time=0.045..0.218 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.021..0.021 rows=50 loops=1)
Planning Time: 2.84 ms
Execution Time: 0.375 ms
```

### After index, run 3

```text
Sort (actual time=0.191..0.193 rows=50 loops=1)
  Bitmap Heap Scan on incident_event (actual time=0.031..0.154 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.014 rows=50 loops=1)
Planning Time: 0.539 ms
Execution Time: 0.249 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Akinwale_Latifat_301923787_P2_Queries.sql, then Akinwale_Latifat_301923787_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Akinwale_Latifat_301923787_P2_QueryResults.png) · [Index comparison](screenshots/Akinwale_Latifat_301923787_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

