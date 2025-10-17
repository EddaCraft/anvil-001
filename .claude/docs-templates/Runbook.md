# [Service/System] Runbook

## Overview

<!-- Brief description of what this system does -->

## Quick Reference

- **Service URL:**
- **Dashboard:**
- **Logs:**
- **Alerts:**
- **On-call contact:**

## Architecture

<!-- High-level system architecture -->

```
[Simple diagram or bullet points]
```

## Common Operations

### Deployment

```bash
# Standard deployment
```

### Health Checks

```bash
# Check service health
curl /health

# Check dependencies
```

### Scaling

```bash
# Scale up
# Scale down
```

## Troubleshooting

### Service Down

1. **Check health endpoint**
   ```bash
   curl /health
   ```
2. **Check logs**
   ```bash
   # Command to view logs
   ```
3. **Restart service**
   ```bash
   # Restart command
   ```

### High Latency

1. **Check metrics dashboard**
2. **Look for resource constraints**
3. **Check external dependencies**

### Database Issues

1. **Check connection pool**
2. **Verify database health**
3. **Check for long-running queries**

## Monitoring & Alerts

### Key Metrics

- **Availability:** Target >99.9%
- **Latency:** Target <200ms p95
- **Error rate:** Target <1%

### Alert Conditions

- **Critical:** Service down >2 minutes
- **Warning:** Error rate >5%
- **Info:** Latency >500ms p95

## Configuration

### Environment Variables

```bash
ENV_VAR_1=value1  # Description
ENV_VAR_2=value2  # Description
```

### Feature Flags

- `feature_flag_name`: Description

## Dependencies

- **Service A:** What it provides
- **Service B:** What it provides
- **Database:** Connection details

## Emergency Contacts

- **Primary:** Name (contact)
- **Secondary:** Name (contact)
- **Escalation:** Team lead (contact)
