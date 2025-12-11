# Forge OS Interactive Chat & Mission Reports Implementation Guide

## Overview

This document provides a concrete implementation plan for adding two major features to the Forge Console:

1. **Interactive Chat** - Advisory-only conversational interface with Forge OS/Orunmila
2. **Mission Reports** - Structured, explainable mission summaries with optional AI narration

Both features integrate with your existing Consult Bridge pattern and maintain the advisory-only principle.

---

## Part 1: Interactive Chat System

### 1.1 Purpose & Philosophy

**Goal**: Single unified place to "talk to" Forge OS / Brainiac / Orunmila

**Advisory-Only Pattern**:
- Chat can propose actions, recommendations, and analysis
- Never executes capital/risk changes directly
- Respects your existing Consult Bridge architecture

**Context-Aware**:
- Global chat: General questions about system state
- Contextual chat: Opened from a specific mission/run/skill with automatic context injection

### 1.2 Data Models

#### Backend Schemas (add to `src/schemas.py`)

```python
from datetime import datetime
from typing import Literal, Any
from pydantic import BaseModel

class ChatContext(BaseModel):
    """Context attached to a chat session"""
    type: Literal["mission", "run", "skill", "report", "system"] | None = None
    id: str | None = None
    name: str | None = None
    sphere: Literal["forge", "orunmila"] | None = None
    metadata: dict[str, Any] = {}

class ChatSession(BaseModel):
    """A chat conversation session"""
    id: str
    title: str
    sphere: Literal["forge", "orunmila"]
    createdAt: datetime
    updatedAt: datetime
    pinned: bool = False
    context: ChatContext | None = None
    messageCount: int = 0
    lastMessage: str | None = None

class ChatMessage(BaseModel):
    """A single message in a chat session"""
    id: str
    sessionId: str
    role: Literal["user", "assistant", "system", "tool"]
    content: str  # Markdown formatted
    createdAt: datetime
    meta: dict[str, Any] = {}  # Can include linked entities, tags, severity

class ChatSessionCreate(BaseModel):
    """Request to create a new chat session"""
    title: str | None = None
    sphere: Literal["forge", "orunmila"]
    context: ChatContext | None = None

class ChatMessageCreate(BaseModel):
    """Request to send a message"""
    content: str
    meta: dict[str, Any] = {}
```

#### Frontend Types (add to `lib/types.ts`)

```typescript
export interface ChatContext {
  type?: "mission" | "run" | "skill" | "report" | "system"
  id?: string
  name?: string
  sphere?: Sphere
  metadata?: Record<string, any>
}

export interface ChatSession {
  id: string
  title: string
  sphere: Sphere
  createdAt: string
  updatedAt: string
  pinned: boolean
  context?: ChatContext
  messageCount: number
  lastMessage?: string
}

export interface ChatMessage {
  id: string
  sessionId: string
  role: "user" | "assistant" | "system" | "tool"
  content: string
  createdAt: string
  meta?: Record<string, any>
}
```

### 1.3 Backend API Implementation

#### Create Chat Router (`src/routers/chat.py`)

```python
from datetime import datetime
from fastapi import APIRouter, HTTPException
from typing import List

from .. import schemas
from ..storage import load_list, save_list

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/sessions", response_model=List[schemas.ChatSession])
def get_sessions(sphere: str | None = None) -> List[schemas.ChatSession]:
    """Get all chat sessions, optionally filtered by sphere"""
    sessions = load_list(schemas.ChatSession, "chat_sessions.json")
    if sphere:
        sessions = [s for s in sessions if s.sphere == sphere]
    return sessions


@router.post("/sessions", response_model=schemas.ChatSession)
def create_session(body: schemas.ChatSessionCreate) -> schemas.ChatSession:
    """Create a new chat session"""
    sessions = load_list(schemas.ChatSession, "chat_sessions.json")

    title = body.title or f"Chat {len(sessions) + 1}"

    new_session = schemas.ChatSession(
        id=f"chat-{int(datetime.utcnow().timestamp())}",
        title=title,
        sphere=body.sphere,
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow(),
        pinned=False,
        context=body.context,
        messageCount=0,
        lastMessage=None,
    )

    sessions.insert(0, new_session)
    save_list(sessions, "chat_sessions.json")
    return new_session


@router.get("/sessions/{session_id}", response_model=schemas.ChatSession)
def get_session(session_id: str) -> schemas.ChatSession:
    """Get a specific chat session"""
    sessions = load_list(schemas.ChatSession, "chat_sessions.json")
    session = next((s for s in sessions if s.id == session_id), None)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.delete("/sessions/{session_id}")
def delete_session(session_id: str):
    """Delete a chat session"""
    sessions = load_list(schemas.ChatSession, "chat_sessions.json")
    sessions = [s for s in sessions if s.id != session_id]
    save_list(sessions, "chat_sessions.json")

    # Also delete messages
    messages = load_list(schemas.ChatMessage, "chat_messages.json")
    messages = [m for m in messages if m.sessionId != session_id]
    save_list(messages, "chat_messages.json")

    return {"status": "deleted"}


@router.get("/sessions/{session_id}/messages", response_model=List[schemas.ChatMessage])
def get_messages(session_id: str, limit: int = 50) -> List[schemas.ChatMessage]:
    """Get messages for a session"""
    messages = load_list(schemas.ChatMessage, "chat_messages.json")
    session_messages = [m for m in messages if m.sessionId == session_id]
    return session_messages[:limit]


@router.post("/sessions/{session_id}/messages", response_model=schemas.ChatMessage)
def send_message(session_id: str, body: schemas.ChatMessageCreate) -> schemas.ChatMessage:
    """Send a message and get AI response"""
    # 1. Verify session exists
    sessions = load_list(schemas.ChatSession, "chat_sessions.json")
    session = next((s for s in sessions if s.id == session_id), None)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 2. Save user message
    messages = load_list(schemas.ChatMessage, "chat_messages.json")

    user_message = schemas.ChatMessage(
        id=f"msg-{int(datetime.utcnow().timestamp() * 1000)}",
        sessionId=session_id,
        role="user",
        content=body.content,
        createdAt=datetime.utcnow(),
        meta=body.meta,
    )
    messages.append(user_message)

    # 3. Generate AI response (stub for now - integrate with Consult Bridge)
    # TODO: Call your Consult Bridge / LLM here
    assistant_content = generate_assistant_response(session, body.content, messages)

    assistant_message = schemas.ChatMessage(
        id=f"msg-{int(datetime.utcnow().timestamp() * 1000) + 1}",
        sessionId=session_id,
        role="assistant",
        content=assistant_content,
        createdAt=datetime.utcnow(),
        meta={},
    )
    messages.append(assistant_message)

    # 4. Update session
    session.updatedAt = datetime.utcnow()
    session.messageCount = len([m for m in messages if m.sessionId == session_id])
    session.lastMessage = body.content[:100]

    save_list(messages, "chat_messages.json")
    save_list(sessions, "chat_sessions.json")

    return assistant_message


def generate_assistant_response(
    session: schemas.ChatSession,
    user_message: str,
    history: List[schemas.ChatMessage]
) -> str:
    """
    Generate assistant response using Consult Bridge

    TODO: Replace with real Consult Bridge integration
    For now, returns a mock response
    """
    context_info = ""
    if session.context:
        context_info = f"\n\n**Context**: {session.context.type} - {session.context.name}"

    return f"""I understand you're asking: "{user_message}"

This is a mock response. In the full implementation, this will:
1. Build context from the session ({session.sphere} sphere)
2. Include relevant mission/run/skill data
3. Call your Consult Bridge API
4. Return advisory-only recommendations

{context_info}

**Suggested Actions** (advisory only):
- Review related logs
- Check system status
- Consult recent reports
"""
```

#### Update `src/main.py`

```python
from .routers import forge, orunmila, chat

# ... existing code ...

app.include_router(chat.router, prefix=settings.api_prefix)
```

#### Add API Endpoints to Config

In `lib/api-config.ts`:

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints ...

  chat: {
    sessions: `${API_BASE_URL}/chat/sessions`,
    session: (id: string) => `${API_BASE_URL}/chat/sessions/${id}`,
    messages: (id: string) => `${API_BASE_URL}/chat/sessions/${id}/messages`,
    deleteSession: (id: string) => `${API_BASE_URL}/chat/sessions/${id}`,
  },
}
```

### 1.4 Frontend Implementation

#### Chat API Client (`lib/api/chat.ts`)

```typescript
import { apiClient } from './client'
import { ChatSession, ChatMessage } from '../types'

export const chatApi = {
  getSessions: (sphere?: string) => {
    const url = sphere ? `/api/chat/sessions?sphere=${sphere}` : '/api/chat/sessions'
    return apiClient.get<ChatSession[]>(url)
  },

  createSession: (data: {
    title?: string
    sphere: string
    context?: any
  }) => apiClient.post<ChatSession>('/api/chat/sessions', data),

  getSession: (id: string) =>
    apiClient.get<ChatSession>(`/api/chat/sessions/${id}`),

  deleteSession: (id: string) =>
    apiClient.delete(`/api/chat/sessions/${id}`),

  getMessages: (sessionId: string) =>
    apiClient.get<ChatMessage[]>(`/api/chat/sessions/${sessionId}/messages`),

  sendMessage: (sessionId: string, content: string) =>
    apiClient.post<ChatMessage>(`/api/chat/sessions/${sessionId}/messages`, { content }),
}
```

#### Chat Hooks (`lib/hooks/use-chat.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '../api/chat'

export const useChatSessions = (sphere?: string) => {
  return useQuery({
    queryKey: ['chat', 'sessions', sphere],
    queryFn: () => chatApi.getSessions(sphere),
  })
}

export const useChatSession = (id: string) => {
  return useQuery({
    queryKey: ['chat', 'sessions', id],
    queryFn: () => chatApi.getSession(id),
    enabled: !!id,
  })
}

export const useChatMessages = (sessionId: string) => {
  return useQuery({
    queryKey: ['chat', 'messages', sessionId],
    queryFn: () => chatApi.getMessages(sessionId),
    enabled: !!sessionId,
    refetchInterval: 3000, // Poll for new messages
  })
}

export const useCreateChatSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: chatApi.createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] })
    },
  })
}

export const useSendMessage = (sessionId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => chatApi.sendMessage(sessionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', sessionId] })
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] })
    },
  })
}
```

#### Chat Page Component (`app/chat/page.tsx`)

Create a new chat page with:
- Left sidebar: Session list
- Right panel: Message thread + input
- Context chips showing linked entities

```typescript
"use client"

import { useState } from "react"
import { useChatSessions, useChatMessages, useSendMessage, useCreateChatSession } from "@/lib/hooks/use-chat"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function ChatPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  const { data: sessions } = useChatSessions()
  const { data: messages } = useChatMessages(selectedSessionId || "")
  const sendMessage = useSendMessage(selectedSessionId || "")
  const createSession = useCreateChatSession()

  const handleSend = () => {
    if (!message.trim()) return
    sendMessage.mutate(message)
    setMessage("")
  }

  return (
    <div className="flex h-screen">
      {/* Session List */}
      <div className="w-80 border-r">
        <div className="p-4">
          <Button
            onClick={() => createSession.mutate({
              sphere: "forge",
              title: "New Chat"
            })}
            className="w-full"
          >
            New Conversation
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-100px)]">
          {sessions?.map(session => (
            <div
              key={session.id}
              onClick={() => setSelectedSessionId(session.id)}
              className={`p-4 cursor-pointer hover:bg-accent ${
                selectedSessionId === session.id ? 'bg-accent' : ''
              }`}
            >
              <div className="font-medium">{session.title}</div>
              <div className="text-sm text-muted-foreground">
                {session.lastMessage}
              </div>
              <Badge variant="outline" className="mt-2">
                {session.sphere}
              </Badge>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          {messages?.map(msg => (
            <div
              key={msg.id}
              className={`mb-4 ${
                msg.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 1.5 Context Integration

Add "Ask Forge" buttons throughout the app:

#### On Mission Detail Page

```typescript
<Button
  onClick={() => {
    createSession.mutate({
      sphere: "forge",
      title: `Chat about ${mission.name}`,
      context: {
        type: "mission",
        id: mission.id,
        name: mission.name,
        sphere: mission.sphere,
      }
    })
  }}
>
  Ask Forge About This Mission
</Button>
```

---

## Part 2: Mission Reports

### 2.1 Data Model

#### Backend Schema (`src/schemas.py`)

```python
class MissionReportStats(BaseModel):
    """Aggregated mission statistics"""
    totalRuns: int
    successfulRuns: int
    failedRuns: int
    successRate: float
    avgDuration: float | None = None
    lastRunTime: datetime | None = None

class MissionReport(BaseModel):
    """Structured mission report"""
    id: str
    missionId: str
    sphere: Literal["forge", "orunmila"]
    generatedAt: datetime
    timeframeStart: datetime
    timeframeEnd: datetime
    status: Literal["ok", "warning", "error"]
    stats: MissionReportStats
    highlights: list[str]
    recommendations: list[str]
    rawMarkdown: str
    generatedBy: Literal["system", "llm", "human"]

class MissionReportGenerate(BaseModel):
    """Request to generate a mission report"""
    from_time: datetime | None = None
    to_time: datetime | None = None
    use_ai: bool = True
```

### 2.2 Backend Implementation

Add to `src/routers/forge.py` and `src/routers/orunmila.py`:

```python
@router.get("/missions/{mission_id}/reports", response_model=List[schemas.MissionReport])
def get_mission_reports(mission_id: str) -> List[schemas.MissionReport]:
    """Get all reports for a mission"""
    reports = load_list(schemas.MissionReport, "mission_reports.json")
    return [r for r in reports if r.missionId == mission_id]


@router.post("/missions/{mission_id}/reports/generate", response_model=schemas.MissionReport)
def generate_mission_report(
    mission_id: str,
    body: schemas.MissionReportGenerate
) -> schemas.MissionReport:
    """Generate a new mission report"""
    # 1. Get mission
    missions = load_list(schemas.Mission, "forge_missions.json")
    mission = next((m for m in missions if m.id == mission_id), None)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    # 2. Get runs in timeframe
    runs = load_list(schemas.Run, "forge_runs.json")
    mission_runs = [r for r in runs if r.missionId == mission_id]

    # 3. Calculate stats
    successful = len([r for r in mission_runs if r.status == "succeeded"])
    failed = len([r for r in mission_runs if r.status == "failed"])
    total = len(mission_runs)

    success_rate = (successful / total * 100) if total > 0 else 0

    durations = [r.duration for r in mission_runs if r.duration]
    avg_duration = sum(durations) / len(durations) if durations else None

    stats = schemas.MissionReportStats(
        totalRuns=total,
        successfulRuns=successful,
        failedRuns=failed,
        successRate=success_rate,
        avgDuration=avg_duration,
        lastRunTime=mission_runs[0].startTime if mission_runs else None,
    )

    # 4. Generate highlights
    highlights = [
        f"{total} runs completed in reporting period",
        f"{success_rate:.1f}% success rate",
    ]
    if failed > 0:
        highlights.append(f"{failed} runs failed - review required")

    # 5. Generate markdown (optionally with AI)
    if body.use_ai:
        markdown = generate_ai_report(mission, stats, mission_runs)
    else:
        markdown = generate_basic_report(mission, stats)

    # 6. Save report
    reports = load_list(schemas.MissionReport, "mission_reports.json")

    report = schemas.MissionReport(
        id=f"report-{int(datetime.utcnow().timestamp())}",
        missionId=mission_id,
        sphere=mission.sphere,
        generatedAt=datetime.utcnow(),
        timeframeStart=body.from_time or datetime.utcnow(),
        timeframeEnd=body.to_time or datetime.utcnow(),
        status="ok" if failed == 0 else "warning" if failed < total / 2 else "error",
        stats=stats,
        highlights=highlights,
        recommendations=[],
        rawMarkdown=markdown,
        generatedBy="llm" if body.use_ai else "system",
    )

    reports.insert(0, report)
    save_list(reports, "mission_reports.json")

    return report


def generate_basic_report(mission: schemas.Mission, stats: schemas.MissionReportStats) -> str:
    """Generate basic deterministic report"""
    return f"""# Mission Report: {mission.name}

## Summary
- **Total Runs**: {stats.totalRuns}
- **Success Rate**: {stats.successRate:.1f}%
- **Successful**: {stats.successfulRuns}
- **Failed**: {stats.failedRuns}
- **Avg Duration**: {stats.avgDuration:.0f}s

## Status
{'✅ All runs successful' if stats.failedRuns == 0 else '⚠️ Some failures detected'}
"""


def generate_ai_report(
    mission: schemas.Mission,
    stats: schemas.MissionReportStats,
    runs: list
) -> str:
    """
    Generate AI-powered narrative report
    TODO: Integrate with Consult Bridge
    """
    return generate_basic_report(mission, stats) + """

## AI Analysis
This would include:
- Trend analysis
- Failure pattern detection
- Recommendations for optimization
- Comparison with historical data
"""
```

### 2.3 Frontend Implementation

Add mission reports tab to mission detail page:

```typescript
"use client"

import { useMissionReports, useGenerateMissionReport } from "@/lib/hooks/use-reports"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"

export function MissionReportsTab({ missionId }: { missionId: string }) {
  const { data: reports } = useMissionReports(missionId)
  const generate = useGenerateMissionReport(missionId)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Mission Reports</h2>
        <Button onClick={() => generate.mutate({ use_ai: true })}>
          Generate Report
        </Button>
      </div>

      {reports?.map(report => (
        <Card key={report.id} className="p-6 mb-4">
          <div className="flex justify-between mb-4">
            <h3>{new Date(report.generatedAt).toLocaleString()}</h3>
            <Badge variant={
              report.status === 'ok' ? 'success' :
              report.status === 'warning' ? 'warning' : 'destructive'
            }>
              {report.status}
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <Stat label="Total Runs" value={report.stats.totalRuns} />
            <Stat label="Success Rate" value={`${report.stats.successRate}%`} />
            <Stat label="Successful" value={report.stats.successfulRuns} />
            <Stat label="Failed" value={report.stats.failedRuns} />
          </div>

          <ReactMarkdown>{report.rawMarkdown}</ReactMarkdown>
        </Card>
      ))}
    </div>
  )
}
```

---

## Implementation Timeline

### Week 1: Chat Backend + Basic UI
- [ ] Add chat schemas to backend
- [ ] Implement chat API endpoints
- [ ] Create JSON storage for sessions/messages
- [ ] Build basic chat UI (session list + messages)

### Week 2: Chat Context Integration
- [ ] Add "Ask Forge" buttons to mission/run pages
- [ ] Implement context passing
- [ ] Add quick prompts
- [ ] Integrate with Consult Bridge (mock first)

### Week 3: Mission Reports
- [ ] Add report schemas
- [ ] Implement report generation endpoints
- [ ] Create reports tab on mission pages
- [ ] Add deterministic report generation

### Week 4: AI Integration + Polish
- [ ] Wire Chat to real Consult Bridge
- [ ] Wire Reports to AI narrative generation
- [ ] Add streaming support (optional)
- [ ] Polish UI/UX

---

## Testing Checklist

### Chat
- [ ] Create new chat session
- [ ] Send messages and receive responses
- [ ] Open chat from mission context
- [ ] View chat history
- [ ] Delete chat sessions

### Reports
- [ ] Generate mission report
- [ ] View report statistics
- [ ] Render markdown correctly
- [ ] Generate with/without AI
- [ ] View report history

---

## Next Steps

1. Review this implementation plan
2. Prioritize features (chat vs reports first?)
3. Set up initial JSON data files for testing
4. Begin backend implementation
5. Build UI components
6. Integrate with Consult Bridge
