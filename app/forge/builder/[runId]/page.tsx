import Link from "next/link";
import { getAutonomyRun } from "@/lib/api/autonomy";
import RunHeader from "@/components/forge/autonomy/RunHeader";
import RunTimeline from "@/components/forge/autonomy/RunTimeline";
import ArtifactsTree from "@/components/forge/autonomy/ArtifactsTree";

export const dynamic = "force-dynamic";

interface BuilderRunDetailPageProps {
  params: { runId: string };
}

export default async function BuilderRunDetailPage({ params }: BuilderRunDetailPageProps) {
  const runId = decodeURIComponent(params.runId);
  const data = await getAutonomyRun(runId);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link className="text-sm underline" href="/forge/builder">
          Back to runs
        </Link>
        <Link className="text-sm underline" href="/forge/jobs">
          Jobs
        </Link>
      </div>

      <RunHeader runId={runId} initialState={data.state} />
      <ArtifactsTree artifactsRoot={data.artifacts_root} tree={data.artifacts_tree} />
      <RunTimeline
        runId={runId}
        initialEvents={data.events}
        initialState={data.state}
        initialLinkedJob={data.linked_job || null}
        initialLastError={data.last_error || null}
      />
    </div>
  );
}
