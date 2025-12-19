# Forge Console - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies

```bash
cd forge-console
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query (TanStack Query)
- Lucide React icons

### Step 2: Configure Environment (Optional)

Create a `.env.local` file if you want to connect to a real backend:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://7d2majjsda.us-east-1.awsapprunner.com/api
```

**Note:** The app will work with mock data by default.

### Step 3: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You'll be automatically redirected to `/forge` (the Forge OS dashboard).

## 🎯 What You'll See

### Forge OS Dashboard (`/forge`)
- KPI cards (Skills, Runs, Reports, System Status)
- Recent runs list
- Recent reports list
- Navigation to all Forge features

### Available Routes

**Forge OS:**
- `/forge` - Dashboard
- `/forge/skills` - Skills management (TODO)
- `/forge/missions` - Missions management (TODO)
- `/forge/runs` - Execution runs (TODO)
- `/forge/reports` - Reports viewer (TODO)
- `/forge/artifacts` - Artifacts browser (TODO)
- `/forge/system` - System status (TODO)

**Orunmila:**
- `/orunmila` - Oracle overview (TODO)
- `/orunmila/skills` - XAU skills (TODO)
- `/orunmila/state/daily` - Daily state (TODO)
- `/orunmila/state/cycle-4w` - 4-Week cycle state (TODO)
- `/orunmila/oracle` - Oracle dashboard (TODO)

## 🔧 Current Status

### ✅ Working
- Project setup and configuration
- TypeScript compilation
- Tailwind CSS styling
- React Query data fetching hooks
- Forge home dashboard with mock data
- UI components (Button, Card, Table, Badge, Tabs)
- Status badges and page headers

### 🚧 In Progress (Stubs Created)
- All API endpoints (returning empty arrays for now)
- Layout components (Shell, Sidebar, Topbar)
- Remaining pages

### 📋 Next Steps for Full Implementation

1. **Complete Layout Components**
   - Shell with sidebar, topbar, console, chat dock
   - Sphere-aware navigation
   - Responsive mobile/tablet layouts

2. **Implement All Pages**
   - Skills list and detail views
   - Missions list and detail views
   - Runs list and detail with logs
   - Reports viewer with markdown/JSON rendering
   - State views for Orunmila

3. **Add Mock Data**
   - Create mock API responses for development
   - Seed data for skills, missions, runs

4. **Complete Features**
   - Run dialog (trigger skill/mission execution)
   - Chat dock (AI assistant)
   - Log console (streaming logs)
   - Filters and search

## 📝 Development Tips

### Adding a New Page

1. Create the page component in `app/[sphere]/[feature]/page.tsx`
2. Use the React Query hooks from `lib/hooks/`
3. Follow the pattern from `app/forge/page.tsx`

Example:
```tsx
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { useForgeSkills } from '@/lib/hooks/useForgeData';

export default function SkillsPage() {
  const { data: skills, isLoading } = useForgeSkills();

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <PageHeader 
        title="Skills" 
        subtitle="Manage and execute skills"
      />
      {/* Your content here */}
    </div>
  );
}
```

### Using API Hooks

All data fetching uses React Query:

```tsx
import { useForgeSkills, useRunForgeSkill } from '@/lib/hooks/useForgeData';

// In your component
const { data: skills, isLoading, error } = useForgeSkills();
const runSkill = useRunForgeSkill();

// Trigger a run
runSkill.mutate({ id: 'skill-123', params: {} });
```

### Styling

Use Tailwind CSS classes for all styling:

```tsx
<div className="flex items-center justify-between p-4 border-b">
  <h2 className="text-2xl font-bold">Title</h2>
  <Button variant="outline">Action</Button>
</div>
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

### TypeScript Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Need Help?

- Check `README.md` for full documentation
- See `ARCHITECTURE.md` for project structure
- Review `lib/types/index.ts` for all type definitions
- Look at `app/forge/page.tsx` for a complete example

## 🎉 You're Ready!

The foundation is built. Now you can:
1. Implement the remaining pages
2. Add the layout shell with navigation
3. Create mock data for development
4. Deploy to Vercel when ready

Happy coding! 🚀
