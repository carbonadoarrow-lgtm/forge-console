# Forge Activity Hub - Operator Runbook

## Overview

The **Activity Hub** (`/forge/activity`) is the central monitoring dashboard for Forge OS operations. It provides a unified view of three key operational areas:

1. **Console Chat** - Advisory-only sessions for operator guidance
2. **Mission Reports** - Summaries and health checks for active missions
3. **Jobs** - Background tasks and autonomous Forge operations

This runbook explains how to interpret Activity Hub data, understand job statuses, and troubleshoot common issues.

---

## What the Activity Hub Shows

### 1. Chat Card

**Purpose**: Shows advisory-only console sessions with Forge OS.

**Key Metrics**:
- Total number of chat sessions
- Unread message count across all sessions
- Latest session preview with:
  - Session title
  - Last message snippet
  - Last updated timestamp

**Navigation**: Click "Open Chat" to access `/forge/chat`

**Operational Notes**:
- Chat is advisory-only and does not trigger autonomous actions
- Unread counts help operators identify pending conversations
- Sessions persist across backend restarts

### 2. Mission Reports Card

**Purpose**: Provides summaries and health statistics for missions.

**Key Metrics**:
- Total number of reports for `mission-1` (hardcoded default)
- Latest report timestamp
- Status badge (OK / WARNING / ERROR)

**Status Meanings**:
- **OK** (green) - Mission is healthy, all checks passing
- **WARNING** (yellow outline) - Minor issues detected, investigate recommended
- **ERROR** (red) - Critical issues, immediate attention required

**Navigation**: Click "View Reports" to access `/forge/missions/mission-1/reports`

**Operational Notes**:
- Reports are generated periodically by mission monitoring jobs
- Check latest report timestamp to ensure monitoring is active
- WARNING/ERROR states should be investigated in the full report view

### 3. Jobs Card

**Purpose**: Monitors background tasks and autonomous Forge operations.

**Key Metrics**:
- Total job count
- Running jobs count
- Failed jobs count (red badge if > 0)

**Navigation**: Click "View Jobs" to access `/forge/jobs`

**Operational Notes**:
- This is the most critical operational metric
- Failed jobs always show a red badge for immediate attention
- Running jobs indicate active background work

---

## Job Statuses Explained

Jobs can be in one of four states. Understanding these states is critical for operations.

### `pending` (Secondary Badge - Gray)

**Meaning**: Job has been created and queued but has not started execution yet.

**When it's Normal**:
- Job was just created seconds ago
- System is processing other jobs first (queue)
- Scheduled jobs waiting for their time window

**When to Investigate**:
- Job has been pending for > 5 minutes
- Multiple jobs stuck in pending state
- No other jobs are running (suggests scheduler issue)

**Troubleshooting Steps**:
1. Check backend logs for scheduler errors
2. Verify job processing loop is running
3. Check for database connection issues
4. Restart backend if scheduler appears frozen

### `running` (Primary Badge - Blue/Default)

**Meaning**: Job is currently executing.

**When it's Normal**:
- Job appeared in running state within 1-2 seconds of creation
- Job duration is reasonable for its type
- Backend logs show active processing

**When to Investigate**:
- Job has been running for > 10 minutes (unless known long-running job)
- Job appears stuck (no log activity)
- Multiple jobs running simultaneously when only 1 is expected

**Troubleshooting Steps**:
1. Check backend logs for job progress/errors
2. Check if job is waiting on external resource (API, file, etc.)
3. Consider if job is legitimately long-running
4. If stuck, restart backend to force job to fail and retry

### `succeeded` (Outline Badge - White/Light Gray)

**Meaning**: Job completed successfully without errors.

**When it's Normal**: Always - this is the desired end state.

**Operational Notes**:
- Succeeded jobs remain in the database for audit/history
- Check job results in backend logs if needed
- No action required

### `failed` (Destructive Badge - Red)

**Meaning**: Job encountered an error and could not complete.

**When it's Critical**:
- Mission-critical jobs (health checks, data sync, etc.)
- Repeated failures of the same job type
- Failed jobs with no retry scheduled

**Troubleshooting Steps**:
1. **Check error message**: Displayed on Jobs page under job card
2. **Review backend logs**: Look for stack traces and error details
3. **Common causes**:
   - External API timeout or error response
   - Database connection lost during execution
   - Invalid job configuration/parameters
   - Missing dependencies or permissions
4. **Resolution**:
   - Fix underlying issue (API credentials, network, etc.)
   - Manually retry job if retry mechanism is available
   - Restart backend if error suggests corrupted state

---

## Sphere Interpretation: `forge` vs `orunmila`

The **sphere** field indicates which operational domain the job belongs to. This helps operators understand job purpose and priority.

### `forge` Sphere

**Purpose**: Autonomous Forge operations and core system tasks.

**Typical Job Types**:
- Mission execution and monitoring
- System health checks
- Data synchronization between components
- Automated report generation
- Background maintenance tasks

**Operational Priority**: **HIGH** - These jobs are core to Forge OS functionality.

**Troubleshooting Notes**:
- Failed `forge` jobs often indicate core system issues
- Stuck `forge` jobs may block other operations
- Monitor `forge` job success rate closely

### `orunmila` Sphere

**Purpose**: Bridge operations and external integrations.

**Typical Job Types**:
- External API calls and data fetching
- Bridge synchronization with Orunmila system
- Third-party service integration tasks
- Data export/import operations

**Operational Priority**: **MEDIUM** - Important but often dependent on external systems.

**Troubleshooting Notes**:
- Failed `orunmila` jobs may indicate external service issues (not Forge fault)
- Transient failures are more common (network, rate limits, etc.)
- Check external service status before investigating Forge internals

### Sphere Grouping on Jobs Page

The `/forge/jobs` page shows two summary cards:
- **Forge Jobs** - Count of all jobs with `sphere: "forge"`
- **Orunmila Jobs** - Count of all jobs with `sphere: "orunmila"`

Use these cards to quickly assess the balance of internal vs. external workload.

---

## Troubleshooting Guide

### Scenario 1: Jobs Stuck in `pending` State

**Symptoms**:
- One or more jobs show `pending` status for > 5 minutes
- No jobs are transitioning to `running`

**Root Causes**:
- Job processing loop not running
- Database connection lost
- Scheduler crashed/frozen

**Resolution Steps**:
1. Check backend logs for errors:
   ```bash
   # Look for scheduler errors or exceptions
   tail -f forge-backend/logs/app.log
   ```
2. Verify backend is responding:
   ```
   curl http://localhost:8001/api/health
   ```
3. Restart backend:
   ```
   Ctrl+C in backend window, then restart start_forge_backend.bat
   ```
4. Monitor Jobs page - pending jobs should transition to running within 10 seconds

### Scenario 2: Jobs Stuck in `running` State

**Symptoms**:
- Job shows `running` status for > 10 minutes (or longer than expected)
- Backend logs show no recent activity for the job

**Root Causes**:
- Job waiting on unresponsive external resource
- Job logic has infinite loop or deadlock
- Backend crashed mid-job (job state not updated)

**Resolution Steps**:
1. Check backend logs for job activity:
   ```bash
   # Search for job ID in logs
   grep "job-123" forge-backend/logs/app.log
   ```
2. If no recent activity, backend likely crashed:
   - Check if backend process is still running
   - Restart backend - job will transition to `failed`
3. If job is actively logging, it may be legitimately processing:
   - Wait for job to complete or timeout
   - Consider increasing timeout if needed

### Scenario 3: Multiple Jobs Failing with Same Error

**Symptoms**:
- Multiple jobs (especially same type) showing `failed` status
- Same or similar error message across jobs

**Root Causes**:
- External API down or credentials invalid
- Database configuration issue
- Shared resource unavailable (file, network, etc.)

**Resolution Steps**:
1. Read error message on Jobs page
2. Check if error is external (API error, timeout, etc.):
   - Verify external service status
   - Check API credentials/tokens
   - Test network connectivity
3. Check if error is internal (database, file I/O, etc.):
   - Verify database is accessible
   - Check file permissions
   - Review backend configuration
4. Fix root cause, then:
   - New jobs should succeed
   - Consider manually retrying failed jobs if retry mechanism exists

### Scenario 4: No Jobs Appearing

**Symptoms**:
- Jobs card shows 0 jobs
- "No jobs found" message on `/forge/jobs`

**Root Causes**:
- Backend not connected to frontend
- Database empty or connection failed
- Jobs API endpoint not responding

**Resolution Steps**:
1. Verify backend is running:
   ```
   Visit http://localhost:8001/api/docs
   Should see FastAPI Swagger UI
   ```
2. Test jobs API directly:
   ```
   curl http://localhost:8001/api/jobs
   Should return JSON array of jobs
   ```
3. If backend returns empty array:
   - No jobs have been created yet (expected for fresh install)
   - Run health check to create test jobs:
     ```
     python scripts/run_health_check_with_jobs.py
     ```
4. If backend returns error or no response:
   - Check backend logs for errors
   - Restart backend

### Scenario 5: Failed Jobs Not Showing Error Message

**Symptoms**:
- Job status is `failed`
- No error message displayed on Jobs page

**Root Causes**:
- Job failed before error handling code executed
- Error message not properly captured in database
- Backend crash during job execution

**Resolution Steps**:
1. Check backend logs for the job ID
2. Look for uncaught exceptions or stack traces
3. If no logs found, job likely failed due to backend crash
4. Fix underlying issue and retry job

---

## Improved UX Copy Proposals

Below are suggested improvements to labels, tooltips, and empty state messages for the Activity and Jobs pages.

### Activity Page (`/forge/activity`)

#### Current vs. Proposed Copy

**Page Header**:
- **Current**: "Live view of Forge OS conversations, mission reports, and background jobs."
- **Proposed**: "Real-time monitoring dashboard for Forge OS chat, missions, and autonomous jobs."
- **Rationale**: "Real-time" is clearer than "live view", and "autonomous" clarifies the nature of jobs.

**Chat Card Description**:
- **Current**: "Advisory-only console sessions with Forge OS."
- **Proposed**: "Operator guidance sessions. Chat does not trigger autonomous actions."
- **Rationale**: Explicitly clarifies that chat is non-operational to avoid confusion.

**Jobs Card Description**:
- **Current**: "Background tasks and autonomous Forge operations."
- **Proposed**: "Automated tasks running in the background. Monitor for failures."
- **Rationale**: More actionable - tells operator what to do (monitor for failures).

**Loading States**:
- **Current**: "Loading chat sessions…", "Loading mission reports…", "Loading jobs…"
- **Proposed**: Add explanatory text if loading takes > 3 seconds:
  ```
  "Loading chat sessions…
  If this persists, check that backend is running at http://localhost:8001"
  ```
- **Rationale**: Helps operators self-diagnose connection issues.

**Empty States** (if applicable):
- **Proposed for Chat**: "No chat sessions yet. Open Chat to start a conversation."
- **Proposed for Mission Reports**: "No reports generated yet. Reports appear after missions run."
- **Proposed for Jobs**: "No jobs found. Run health check or create a job to get started."

#### Tooltips to Add

Add hover tooltips (using `title` attribute or tooltip component):

- **"Chat" card title**: "💬 Tooltip: Advisory-only sessions. No autonomous actions triggered."
- **"Mission Reports" card title**: "📊 Tooltip: Health summaries for active missions. Check for warnings/errors."
- **"Jobs" card title**: "⚙️ Tooltip: Background tasks. Red badge means failed jobs need attention."
- **Unread count**: "Tooltip: Total unread messages across all sessions."
- **Running jobs badge**: "Tooltip: Jobs currently executing."
- **Failed jobs badge**: "Tooltip: Jobs that encountered errors. Click to view details."

### Jobs Page (`/forge/jobs`)

#### Current vs. Proposed Copy

**Page Header**:
- **Current**: "Background tasks and autonomous Forge operations."
- **Proposed**: "Real-time view of all background jobs. Monitor status and troubleshoot failures."
- **Rationale**: More actionable and clarifies purpose.

**Summary Card Titles**:
- **Current**: "Total", "Running", "Pending", "Succeeded", "Failed"
- **Proposed**: Keep as-is (clear and concise)

**Summary Card Descriptions**:
- **Current**: "All jobs", "Active jobs", "Queued jobs", etc.
- **Proposed Improvements**:
  - **Total**: "All jobs" → "All jobs across both spheres"
  - **Running**: "Active jobs" → "Currently executing"
  - **Pending**: "Queued jobs" → "Waiting to start"
  - **Succeeded**: "Jobs that succeeded" → "Completed successfully"
  - **Failed**: "Jobs that failed" → "Encountered errors - requires attention"

**Sphere Card Descriptions**:
- **Current**:
  - Forge: "Autonomous Forge operations"
  - Orunmila: "Bridge & external tasks"
- **Proposed**:
  - Forge: "Core Forge OS tasks (high priority)"
  - Orunmila: "External integrations and bridge sync"
- **Rationale**: Clarifies priority and purpose.

**Recent Jobs Section**:
- **Current**: "Recent Jobs"
- **Proposed**: "Recent Jobs (Last 10)" or "Job History"
- **Rationale**: Clarifies that this is a limited subset.

**Empty State**:
- **Current**: "No jobs found."
- **Proposed**:
  ```
  "No jobs found.

  Jobs appear here after:
  • Running health checks: python scripts/run_health_check_with_jobs.py
  • Starting a mission
  • Triggering autonomous operations

  If you expect to see jobs, check that the backend is running."
  ```
- **Rationale**: Actionable guidance for new operators.

**Error Message Display**:
- **Current**: "Error: {job.error_message}" (red text under job)
- **Proposed**: Keep as-is, but add:
  - Truncate long errors to first 100 chars with "... (see logs for full error)"
  - Add tooltip on hover showing full error

#### Tooltips to Add

- **Job name**: "Tooltip: Click to view detailed logs (if detail page exists)"
- **Sphere badge**:
  - If `forge`: "Tooltip: Core Forge operation (high priority)"
  - If `orunmila`: "Tooltip: External integration task"
- **Status badge**:
  - `pending`: "Tooltip: Queued - should start within seconds"
  - `running`: "Tooltip: Currently executing - check logs for progress"
  - `succeeded`: "Tooltip: Completed successfully"
  - `failed`: "Tooltip: Error occurred - see error message below or check logs"
- **Job ID**: "Tooltip: Unique identifier for backend logs and debugging"
- **Created timestamp**: "Tooltip: When this job was created"

#### Status Badge Color Consistency

Current implementation is good, but ensure consistency:
- `pending` → `secondary` (gray)
- `running` → `default` (blue/primary)
- `succeeded` → `outline` (white/light gray border)
- `failed` → `destructive` (red)

**Proposed Addition**: Add small status icons alongside text:
- `pending` → ⏳ Pending
- `running` → ▶️ Running
- `succeeded` → ✓ Succeeded
- `failed` → ✗ Failed

### General UX Improvements

1. **Add refresh indicator**: Show a subtle indicator when data is being refetched (react-query handles this).

2. **Add last updated timestamp**:
   ```
   "Last updated: 2 seconds ago" (top-right corner of page)
   ```

3. **Add manual refresh button**:
   ```jsx
   <Button onClick={() => refetch()} size="sm">
     <RefreshCw className="h-4 w-4" /> Refresh
   </Button>
   ```

4. **Failed job alert**: If any failed jobs exist, show a subtle alert banner at top:
   ```
   ⚠️ 3 jobs have failed. Review errors on the Jobs page.
   ```

5. **Link job names**: Make job names clickable to jump to detail view (if implemented).

6. **Add filtering**: Allow filtering by status or sphere (future enhancement).

7. **Add sorting**: Allow sorting by created_at, status, sphere (future enhancement).

---

## Quick Reference

### Healthy System Indicators
✅ No failed jobs (or failed count = 0)
✅ Running jobs = 0-2 (depending on workload)
✅ Pending jobs = 0 (or quickly transitioning to running)
✅ Latest mission report status = OK
✅ Backend logs show no errors

### Unhealthy System Indicators
❌ Multiple failed jobs (> 3)
❌ Jobs stuck in pending for > 5 minutes
❌ Jobs stuck in running for > 10 minutes
❌ Latest mission report status = ERROR
❌ Jobs page shows "No jobs found" when jobs should exist

### Emergency Contacts / Escalation
- **Backend issues**: Check backend logs at `forge-backend/logs/app.log`
- **Database issues**: Verify database connection in backend config
- **External API issues**: Check external service status pages
- **If all else fails**: Restart both backend and frontend, then re-test

---

## Appendix: Job Lifecycle Diagram

```
┌─────────────┐
│   Created   │
│  (pending)  │
└──────┬──────┘
       │
       │ Picked up by scheduler
       ▼
┌─────────────┐
│  Executing  │
│  (running)  │
└──────┬──────┘
       │
       ├──── Success ────► ┌────────────┐
       │                   │ (succeeded)│
       │                   └────────────┘
       │
       └──── Error ──────► ┌───────────┐
                           │  (failed) │
                           └───────────┘
```

**Notes**:
- Jobs can skip `pending` and go straight to `running` if scheduler picks them up immediately
- Failed jobs remain in database for audit purposes
- There is no automatic retry mechanism (as of current implementation)
- Jobs cannot transition from `succeeded` or `failed` back to `pending`/`running`

---

**Document Version**: 1.0
**Last Updated**: 2025-12-10
**Maintained By**: Forge OS Operations Team
