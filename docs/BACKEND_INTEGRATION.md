# Backend Integration Guide

This guide walks you through connecting the Forge Console frontend to the live backend.

## Overview

The Forge Console can run in two modes:

1. **Mock Mode** - Uses in-memory mock data (default for development)
2. **Live Mode** - Connects to the FastAPI backend at `https://7d2majjsda.us-east-1.awsapprunner.com/api`

## Prerequisites

- Python 3.10+ installed
- Backend server running (see backend setup below)

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd /c/Users/Jwmor/Desktop/forge-backend
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Start Backend Server

```bash
uvicorn src.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 5. Verify Backend is Running

Open your browser or use curl:

```bash
# Root endpoint
curl https://7d2majjsda.us-east-1.awsapprunner.com/

# Health check
curl https://7d2majjsda.us-east-1.awsapprunner.com/healthz

# Get Forge skills
curl https://7d2majjsda.us-east-1.awsapprunner.com/api/forge/skills

# Get Orunmila daily state
curl https://7d2majjsda.us-east-1.awsapprunner.com/api/orunmila/state/daily
```

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd /c/Users/Jwmor/Desktop/forge-console
```

### 2. Create Environment File

```bash
cp .env.example .env.local
```

### 3. Configure API Connection

Edit `.env.local`:

```env
# Point to the backend API
NEXT_PUBLIC_API_BASE_URL=https://7d2majjsda.us-east-1.awsapprunner.com/api

# Optional: Set to true to use mock data instead
# NEXT_PUBLIC_USE_MOCK_DATA=false
```

### 4. Install Dependencies (if not already done)

```bash
npm install
```

### 5. Start Frontend

```bash
npm run dev
```

The console will be available at `http://localhost:3000`

## Testing the Integration

### 1. View Skills

Navigate to:
- Forge: `http://localhost:3000` (Overview tab)
- Orunmila: Switch to Orunmila sphere

You should see skills loaded from the backend.

### 2. Trigger a Run

Click the "Run" button on any skill. The frontend will:
1. POST to `/api/forge/skills/{id}/run`
2. Backend creates a new run in `forge_runs.json`
3. Frontend displays the new run in the Runs list

### 3. View States (Orunmila)

Switch to Orunmila sphere and navigate to "Oracle Overview". You should see:
- Daily State
- 4-Week Cycle State
- Structural State

All loaded from the backend.

## Troubleshooting

### Backend Not Starting

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**: Make sure you activated the virtual environment and ran `pip install -r requirements.txt`

```bash
cd /c/Users/Jwmor/Desktop/forge-backend
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### CORS Errors

**Error**: `Access to fetch at 'https://7d2majjsda.us-east-1.awsapprunner.com/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution**: Check backend `src/config.py` includes `http://localhost:3000` in `cors_origins`:

```python
cors_origins: list[str] = ["http://localhost:3000"]
```

Restart the backend after changing.

### Frontend Not Connecting

**Error**: `Network error or server unavailable`

**Solution**:
1. Verify backend is running: `curl https://7d2majjsda.us-east-1.awsapprunner.com/healthz`
2. Check `.env.local` has correct API URL: `NEXT_PUBLIC_API_BASE_URL=https://7d2majjsda.us-east-1.awsapprunner.com/api`
3. Restart frontend: `npm run dev`

### Empty Data

**Error**: Skills/missions show as empty

**Solution**: Check that JSON data files exist in `forge-backend/data/`:
- `forge_skills.json`
- `forge_missions.json`
- `orunmila_skills.json`
- etc.

## Running Both Servers

### Option 1: Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd /c/Users/Jwmor/Desktop/forge-backend
.venv\Scripts\activate
uvicorn src.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd /c/Users/Jwmor/Desktop/forge-console
npm run dev
```

### Option 2: Background Process (Windows PowerShell)

```powershell
# Start backend in background
cd C:\Users\Jwmor\Desktop\forge-backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".venv\Scripts\activate; uvicorn src.main:app --reload --port 8000"

# Start frontend
cd C:\Users\Jwmor\Desktop\forge-console
npm run dev
```

## API Documentation

With the backend running, view interactive API docs at:

- **Swagger UI**: https://7d2majjsda.us-east-1.awsapprunner.com/api/docs
- **ReDoc**: https://7d2majjsda.us-east-1.awsapprunner.com/api/redoc

## Development Workflow

1. **Make backend changes**: Edit files in `forge-backend/src/`
2. **Backend auto-reloads**: Uvicorn will automatically reload
3. **Make frontend changes**: Edit files in `forge-console/`
4. **Frontend auto-reloads**: Next.js will hot-reload

## Next Steps

### Phase 3: Connect to Real Orunmila/Forge Data

Replace JSON files with real data sources:

1. Create adapters in `forge-backend/src/adapters/`
2. Update routes to use adapters
3. Configure backend mode: `FORGE_BACKEND_MODE=sandbox`

### Phase 4: Add Authentication

1. Install auth dependencies
2. Create JWT authentication
3. Protect sensitive endpoints
4. Add login flow to frontend

### Phase 5: Deploy to Production

1. Set up production environment
2. Configure HTTPS
3. Set `FORGE_BACKEND_MODE=prod`
4. Deploy backend (Docker, systemd, etc.)
5. Deploy frontend (Vercel, static hosting)

## Reference

- [Backend README](../../forge-backend/README.md)
- [API Contracts](./api/CONTRACTS.md)
- [Frontend API Client](../lib/api/client.ts)
