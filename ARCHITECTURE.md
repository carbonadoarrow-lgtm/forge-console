# Forge Console Architecture

## Project Structure

```
forge-console/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page (redirects to /forge)
│   ├── globals.css              # Global styles
│   ├── forge/                   # Forge OS sphere routes
│   │   ├── page.tsx            # Forge home dashboard
│   │   ├── skills/
│   │   │   ├── page.tsx        # Skills list
│   │   │   └── [id]/page.tsx   # Skill detail
│   │   ├── missions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── runs/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── reports/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── artifacts/
│   │   │   └── page.tsx
│   │   └── system/
│   │       └── page.tsx
│   └── orunmila/               # Orunmila sphere routes
│       ├── page.tsx
│       ├── skills/
│       ├── missions/
│       ├── runs/
│       ├── reports/
│       ├── state/
│       │   ├── daily/page.tsx
│       │   ├── cycle-4w/page.tsx
│       │   └── structural/page.tsx
│       └── oracle/
│           └── page.tsx
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── layout/                  # Layout components
│   │   ├── shell.tsx           # Main shell layout
│   │   ├── topbar.tsx          # Top navigation bar
│   │   ├── sidebar.tsx         # Left sidebar navigation
│   │   ├── console.tsx         # Bottom log console
│   │   └── chat-dock.tsx       # Right chat dock
│   └── shared/                  # Shared feature components
│       ├── status-badge.tsx
│       ├── page-header.tsx
│       ├── sphere-switcher.tsx
│       ├── json-viewer.tsx
│       ├── markdown-viewer.tsx
│       ├── run-dialog.tsx
│       └── ...
├── lib/
│   ├── api/                     # API client functions
│   │   ├── client.ts           # Base API client
│   │   ├── forge.ts            # Forge API endpoints
│   │   ├── orunmila.ts         # Orunmila API endpoints
│   │   └── chat.ts             # Chat API endpoints
│   ├── hooks/                   # React Query hooks
│   │   ├── useForgeData.ts
│   │   ├── useOrunmilaData.ts
│   │   └── useChat.ts
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md

## Key Features

### 1. Sphere-Based Architecture
- Two spheres: Forge OS and Orunmila
- Shared UI shell with sphere-specific content
- Sphere-aware navigation and context

### 2. Core Pages (Both Spheres)
- Home Dashboard
- Skills (list + detail)
- Missions (list + detail)
- Runs (list + detail with logs)
- Reports (list + detail)

### 3. Orunmila-Specific Pages
- State Views (Daily, 4-Week Cycle, Structural)
- Oracle Dashboard

### 4. Shared Components
- Chat Dock (context-aware AI assistant)
- Log Console (streaming logs)
- Run Dialog (trigger skill/mission runs)
- Status Badges
- JSON/Markdown Viewers

### 5. Responsive Design
- Desktop: Full layout with sidebar, console, chat
- Tablet (unfolded): Sidebar visible, optional console
- Mobile (folded): Hamburger menu, hidden console

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React

## API Integration

All API calls are abstracted through:
1. API client (`lib/api/client.ts`)
2. Endpoint modules (`lib/api/forge.ts`, `lib/api/orunmila.ts`)
3. React Query hooks (`lib/hooks/*`)

This allows for easy swapping between mock data and real API endpoints.

## Deployment

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Deploy to Vercel or any Node.js hosting platform.
