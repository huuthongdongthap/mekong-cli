---
name: business-report
description: "Business performance report — revenue, growth, operational metrics, recommendations. 3 steps, ~20 min."
---

# /analytics:business-report — Business Performance Report

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── data-collection         → raw-metrics.md
  ├── analysis                → insights.md
  └── report-assembly         → business-report.md
```

## Output directory: reports/analytics/business-report/
