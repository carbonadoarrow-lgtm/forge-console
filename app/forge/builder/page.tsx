import Link from "next/link";
import { listAutonomyRuns } from "@/lib/api/autonomy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function BuilderRunsPage() {
  const data = await listAutonomyRuns();

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Builder Cockpit</h1>
        <Link className="text-sm underline" href="/forge/jobs">
          Go to Jobs
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.runs.length === 0 ? (
              <div className="text-sm text-muted-foreground">No autonomy runs found.</div>
            ) : (
              data.runs.map((r) => (
                <Link
                  key={r.run_id}
                  className="block rounded-xl border px-3 py-2 hover:bg-muted/30"
                  href={`/forge/builder/${encodeURIComponent(r.run_id)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm">{r.run_id}</div>
                    <div className="text-xs">{r.status ?? "UNKNOWN"}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    task={r.task_id ?? "?"} · kind={r.task_kind ?? "?"} · env={r.env ?? "?"} · lane={r.lane ?? "?"}
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
