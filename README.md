# Forge Console

A unified web application for managing **Forge OS** and **Orunmila** systems. Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
cd forge-console

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
forge-console/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Landing page (redirects to /forge)
│   ├── globals.css          # Global styles
│   ├── forge/               # Forge OS sphere
│   │   ├── page.tsx         # Dashboard
│   │   ├── skills/          # Skills management
│   │   ├── missions/        # Missions management
│   │   ├── runs/            # Execution runs
│   │   ├── reports/         # Reports viewer
│   │   ├── artifacts/       # Artifacts browser
│   │   └── system/          # System status
│   └── orunmila/            # Orunmila sphere
│       ├── page.tsx         # Oracle overview
│       ├── skills/          # XAU skills
│       ├── missions/        # Trading missions
│       ├── state/           # State views (daily, cycle, structural)
│       └── oracle/          # Oracle dashboard
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components
│   │   ├── shell.tsx       # Main shell
│   │   ├── topbar.tsx      # Top navigation
│   │   ├── sidebar.tsx     # Left sidebar
│   │   ├── console.tsx     # Bottom log console
│   │   └── chat-dock.tsx   # Right chat dock
│   └── shared/              # Shared components
│       ├── status-badge.tsx
│       ├── page-header.tsx
│       └── ...
├── lib/
│   ├── api/                 # API client functions
│   ├── hooks/               # React Query hooks
│   ├── types/               # TypeScript types
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## 🎯 Key Features

### Dual Sphere Architecture

**Forge OS Sphere:**
- Infrastructure and runtime management
- Skills, missions, and runs tracking
- System monitoring and diagnostics
- Artifact management

**Orunmila Sphere:**
- XAU (gold) trading intelligence
- State management (Daily, 4-Week Cycle, Structural)
- Oracle dashboard with market metrics
- Trading briefs and post-mortems

### Core Components

1. **Shell Layout**
   - Top bar with sphere switcher
   - Collapsible sidebar navigation
   - Bottom log console
   - Right-side chat dock

2. **Skills & Missions**
   - Browse and search
   - View details and configuration
   - Trigger safe runs
   - View execution history

3. **Runs Management**
   - Monitor active and completed runs
   - Streaming logs
   - Status tracking
   - Artifact access

4. **Reports & Analytics**
   - View generated reports
   - Markdown/JSON rendering
   - Link to related runs
   - Historical tracking

5. **Chat Dock (Consult Bridge)**
   - Context-aware AI assistant
   - Sphere-specific knowledge
   - Run/report discussion
   - State analysis

### Responsive Design

- **Desktop**: Full layout with all panels
- **Tablet**: Sidebar visible, optional console
- **Mobile**: Hamburger menu, overlay panels

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### API Integration

The app expects backend APIs at:

**Forge Endpoints:**
- `GET /api/forge/skills`
- `GET /api/forge/missions`
- `GET /api/forge/runs`
- `GET /api/forge/reports`
- `GET /api/forge/artifacts`
- `GET /api/forge/system/status`
- `POST /api/forge/skills/{id}/run`
- `POST /api/forge/missions/{id}/run`

**Orunmila Endpoints:**
- `GET /api/orunmila/skills`
- `GET /api/orunmila/missions`
- `GET /api/orunmila/runs`
- `GET /api/orunmila/reports`
- `GET /api/orunmila/state/daily`
- `GET /api/orunmila/state/cycle-4w`
- `GET /api/orunmila/state/structural`
- `GET /api/orunmila/oracle/dashboard`

**Chat Endpoints:**
- `POST /api/chat/sessions`
- `POST /api/chat/sessions/{id}/messages`
- `GET /api/chat/sessions/{id}/stream` (SSE)

## 🛠️ Development

### Adding New Pages

1. Create route in `app/[sphere]/[feature]/page.tsx`
2. Add navigation item to sidebar config
3. Create API hook in `lib/hooks/`
4. Implement page component

### Adding UI Components

```bash
# Components are manually created based on shadcn/ui
# See components/ui/ for examples
```

### Type Definitions

All types are defined in `lib/types/index.ts`:
- `Skill`, `Mission`, `Run`, `Report`
- `DailyState`, `Cycle4WState`, `StructuralState`
- `ChatSession`, `ChatMessage`
- API response shapes

## 📦 Build & Deploy

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 🎨 Customization

### Theme

Edit CSS variables in `app/globals.css`:
- Light/dark mode colors
- Border radius
- Component styles

### Navigation

Update sidebar config in `components/layout/sidebar.tsx`:
```typescript
const forgeNav = [
  { label: 'Home', href: '/forge', icon: 'Home' },
  { label: 'Skills', href: '/forge/skills', icon: 'Zap' },
  // ...
];
```

## 📝 Status

### ✅ Implemented
- Project structure and configuration
- Type definitions
- API client with React Query
- UI components (Button, Card, Table, Badge, Tabs)
- Shared components (StatusBadge, PageHeader)
- Forge home dashboard

### 🚧 In Progress
- Layout components (Shell, Sidebar, Topbar, Console, ChatDock)
- All page views (Skills, Missions, Runs, Reports, etc.)
- Orunmila state views
- Run dialog and execution UI
- Log streaming
- Chat dock implementation

### 📋 TODO
- Mock API data for development
- Complete all page implementations
- Responsive layout testing
- Dark mode toggle
- User preferences
- Error boundaries
- Loading states
- Deployment configuration

## 🤝 Contributing

This is an internal project. For questions or issues, contact the Forge OS team.

## 📄 License

Internal use only - All rights reserved.

---

**Built with:**
- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/)
- [Lucide Icons](https://lucide.dev/)
