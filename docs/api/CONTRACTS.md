# Forge Console API Contracts

This document defines the API contracts between the Forge Console frontend and backend services.

## Overview

The API follows RESTful principles and uses JSON for data exchange. All endpoints are prefixed with `/api`.

## Common Types

### Enums

```typescript
Sphere = "forge" | "orunmila"
RunStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled"
SystemStatus = "ok" | "warning" | "error" | "degraded"
TriggerSource = "manual" | "scheduled" | "api"
ContentType = "markdown" | "json" | "text" | "html"
```

### Error Response

All errors follow this structure:

```json
{
  "error": "Error message here",
  "code": "ERROR_CODE",
  "details": {}
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## Forge API Endpoints

### Skills

#### `GET /api/forge/skills`

Get all Forge skills.

**Response:** `Skill[]`

```json
[
  {
    "id": "skill-1",
    "name": "CI Pipeline Validator",
    "description": "Validates CI/CD pipeline configuration",
    "type": "runtime",
    "sphere": "forge",
    "lastRunTime": "2025-12-09T10:00:00Z",
    "lastRunStatus": "succeeded",
    "tags": ["ci", "validation"],
    "config": {},
    "can_run": true,
    "can_edit_config": false
  }
]
```

#### `GET /api/forge/skills/{id}`

Get a specific skill by ID.

**Response:** `Skill`

#### `POST /api/forge/skills/{id}/run`

Trigger a skill run.

**Request Body (optional):**
```json
{
  "triggerSource": "manual"
}
```

**Response:** `Run`

```json
{
  "id": "run-123",
  "type": "skill",
  "name": "CI Pipeline Validator",
  "skillId": "skill-1",
  "sphere": "forge",
  "status": "running",
  "startTime": "2025-12-10T12:00:00Z",
  "triggerSource": "manual"
}
```

### Missions

#### `GET /api/forge/missions`

Get all Forge missions.

**Response:** `Mission[]`

```json
[
  {
    "id": "mission-1",
    "name": "Daily Infrastructure Check",
    "description": "Comprehensive infrastructure health check",
    "type": "daily",
    "sphere": "forge",
    "lastRunTime": "2025-12-09T09:00:00Z",
    "lastRunStatus": "succeeded",
    "skills": ["skill-1", "skill-2"],
    "can_run": true
  }
]
```

#### `GET /api/forge/missions/{id}`

Get a specific mission by ID.

**Response:** `Mission`

#### `POST /api/forge/missions/{id}/run`

Trigger a mission run.

**Request Body (optional):**
```json
{
  "triggerSource": "manual"
}
```

**Response:** `Run`

### Runs

#### `GET /api/forge/runs`

Get all Forge runs.

**Response:** `Run[]`

```json
[
  {
    "id": "run-123",
    "type": "skill",
    "name": "CI Pipeline Validator",
    "skillId": "skill-1",
    "sphere": "forge",
    "status": "succeeded",
    "startTime": "2025-12-10T12:00:00Z",
    "endTime": "2025-12-10T12:05:00Z",
    "duration": 300,
    "triggerSource": "manual",
    "reportId": "report-456"
  }
]
```

#### `GET /api/forge/runs/{id}`

Get a specific run by ID.

**Response:** `Run`

#### `GET /api/forge/runs/{id}/logs`

Get logs for a specific run.

**Response:**
```json
{
  "logs": "Run output here..."
}
```

### Reports

#### `GET /api/forge/reports`

Get all Forge reports.

**Response:** `Report[]`

```json
[
  {
    "id": "report-456",
    "title": "CI Pipeline Validation Report",
    "type": "run",
    "relatedSkillId": "skill-1",
    "relatedRunId": "run-123",
    "sphere": "forge",
    "content": "# Report\n\nAll checks passed.",
    "contentType": "markdown",
    "createdAt": "2025-12-10T12:05:00Z"
  }
]
```

#### `GET /api/forge/reports/{id}`

Get a specific report by ID.

**Response:** `Report`

### Artifacts

#### `GET /api/forge/artifacts`

Get all Forge artifacts.

**Response:** `Artifact[]`

```json
[
  {
    "id": "artifact-789",
    "path": "/artifacts/run-123/output.log",
    "name": "output.log",
    "type": "log",
    "size": 1024,
    "runId": "run-123",
    "sphere": "forge",
    "createdAt": "2025-12-10T12:05:00Z",
    "url": "https://7d2majjsda.us-east-1.awsapprunner.com/api/artifacts/run-123/output.log"
  }
]
```

#### `GET /api/forge/artifacts/{id}`

Get a specific artifact by ID.

**Response:** `Artifact`

### System

#### `GET /api/forge/system/status`

Get system status.

**Response:**
```json
{
  "status": "ok",
  "subsystems": {
    "runtime": "ok",
    "storage": "ok",
    "networking": "ok"
  }
}
```

---

## Orunmila API Endpoints

### Skills

#### `GET /api/orunmila/skills`

Get all Orunmila skills.

**Response:** `Skill[]` (same structure as Forge skills with `sphere: "orunmila"`)

#### `GET /api/orunmila/skills/{id}`

Get a specific skill by ID.

**Response:** `Skill`

#### `POST /api/orunmila/skills/{id}/run`

Trigger a skill run.

**Response:** `Run`

### Missions

#### `GET /api/orunmila/missions`

Get all Orunmila missions.

**Response:** `Mission[]`

#### `GET /api/orunmila/missions/{id}`

Get a specific mission by ID.

**Response:** `Mission`

#### `POST /api/orunmila/missions/{id}/run`

Trigger a mission run.

**Response:** `Run`

### Runs

#### `GET /api/orunmila/runs`

Get all Orunmila runs.

**Response:** `Run[]`

#### `GET /api/orunmila/runs/{id}`

Get a specific run by ID.

**Response:** `Run`

#### `GET /api/orunmila/runs/{id}/logs`

Get logs for a specific run.

**Response:** Same as Forge

### Reports

#### `GET /api/orunmila/reports`

Get all Orunmila reports.

**Response:** `Report[]`

#### `GET /api/orunmila/reports/{id}`

Get a specific report by ID.

**Response:** `Report`

### State Endpoints

#### `GET /api/orunmila/state/daily`

Get current daily state.

**Response:** `DailyState`

```json
{
  "date": "2025-12-10",
  "regime": "ranging",
  "stance": "neutral",
  "confidence": 75,
  "keyLevels": {
    "resistance": [2050.0, 2055.5],
    "support": [2040.0, 2035.5]
  },
  "technical": {
    "d1": "bullish",
    "h4": "neutral",
    "h1": "bearish",
    "m15": "neutral"
  },
  "institutionalZones": [],
  "tradeIdeas": []
}
```

#### `GET /api/orunmila/state/daily/history`

Get historical daily states.

**Query Parameters:**
- `from` (optional): Start date (ISO 8601)
- `to` (optional): End date (ISO 8601)
- `limit` (optional): Max number of records (default: 30)

**Response:** `DailyState[]`

#### `GET /api/orunmila/state/cycle-4w`

Get current 4-week cycle state.

**Response:** `CycleState`

```json
{
  "startDate": "2025-11-15",
  "endDate": "2025-12-13",
  "stance": "accumulation",
  "lessons": [
    "Focus on key levels",
    "Avoid overtrading"
  ],
  "performance": {
    "trades": 15,
    "wins": 10,
    "losses": 5,
    "pnl": 1250.0
  }
}
```

#### `GET /api/orunmila/state/structural`

Get structural state.

**Response:** `StructuralState`

```json
{
  "longTerm": "bullish",
  "majorLevels": [2000.0, 2050.0, 2100.0],
  "notes": "Long-term uptrend intact with support at 2000"
}
```

#### `GET /api/orunmila/oracle/dashboard`

Get Oracle dashboard data (consolidated view).

**Response:**
```json
{
  "dailyState": {},
  "cycleState": {},
  "structuralState": {},
  "recentRuns": [],
  "recentReports": []
}
```

---

## Chat API Endpoints

### Sessions

#### `GET /api/chat/sessions`

Get all chat sessions.

**Response:** `ChatSession[]`

#### `GET /api/chat/sessions/{id}`

Get a specific session.

**Response:** `ChatSession`

#### `POST /api/chat/sessions`

Create a new chat session.

**Request Body:**
```json
{
  "sphere": "forge",
  "context": {
    "type": "run",
    "id": "run-123",
    "name": "CI Pipeline Validator"
  }
}
```

**Response:** `ChatSession`

#### `GET /api/chat/sessions/{id}/messages`

Get messages for a session.

**Response:** `ChatMessage[]`

#### `POST /api/chat/sessions/{id}/messages`

Send a message.

**Request Body:**
```json
{
  "content": "What went wrong with this run?"
}
```

**Response:** `ChatMessage`

#### `GET /api/chat/sessions/{id}/stream`

Stream chat responses (SSE).

**Response:** Server-Sent Events stream

---

## TypeScript Type Definitions

See `lib/types.ts` for the complete TypeScript definitions:

- `Skill`
- `Mission`
- `Run`
- `Report`
- `Artifact`
- `DailyState`
- `CycleState`
- `StructuralState`
- `ChatSession`
- `ChatMessage`

---

## Implementation Notes

### Version 1 (File-based)

- All GET endpoints read from JSON files in `/data` directory
- POST `/run` endpoints append to runs JSON file
- No authentication required
- CORS enabled for `http://localhost:3000`

### Version 2 (Sandbox/Production)

- Adapters layer for real data sources
- Authentication via JWT
- Rate limiting on POST endpoints
- WebSocket support for real-time updates

### Error Handling

All endpoints should return appropriate HTTP status codes and error messages:

```json
{
  "error": "Skill not found",
  "code": "SKILL_NOT_FOUND"
}
```

### Pagination (Future)

For list endpoints, pagination will be added:

**Query Parameters:**
- `limit`: Number of items per page
- `offset`: Number of items to skip
- `sort`: Sort field
- `order`: `asc` or `desc`

---

## Testing Checklist

- [ ] All Forge endpoints return correct data structure
- [ ] All Orunmila endpoints return correct data structure
- [ ] POST /run endpoints create new runs
- [ ] Error responses follow contract
- [ ] CORS headers are present
- [ ] Content-Type is application/json
