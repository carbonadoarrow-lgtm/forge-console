"use client";

import { useMemo, useState } from "react";

type Node = {
  name: string;
  path: string;
  type: "dir" | "file";
  truncated?: boolean;
  children?: Node[];
};

function NodeView({ node, depth = 0 }: { node: Node; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isDir = node.type === "dir";

  return (
    <div style={{ paddingLeft: depth * 12 }} className="text-xs">
      <div className="flex items-center gap-2 py-1">
        {isDir ? (
          <button
            className="w-6 text-left"
            onClick={() => setOpen(!open)}
            aria-label="toggle directory"
            type="button"
          >
            {open ? "▾" : "▸"}
          </button>
        ) : (
          <div className="w-6" />
        )}

        <div className="font-mono">
          {isDir ? "📁" : "📄"} {node.name}
          {node.truncated ? <span className="text-muted-foreground"> (truncated)</span> : null}
        </div>
      </div>

      {isDir && open && node.children ? (
        <div>
          {node.children.map((c, i) => (
            <NodeView key={`${c.path}-${i}`} node={c} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ArtifactsTree({
  artifactsRoot,
  tree,
}: {
  artifactsRoot?: string | null;
  tree?: Record<string, any> | null;
}) {
  const parsed = useMemo(() => (tree ? (tree as Node) : null), [tree]);

  return (
    <div className="rounded-2xl border p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Artifacts</div>
        <div className="text-xs text-muted-foreground truncate max-w-xs text-right">
          {artifactsRoot ? artifactsRoot : "—"}
        </div>
      </div>

      {!parsed ? (
        <div className="text-sm text-muted-foreground">No artifacts detected for the linked job.</div>
      ) : (
        <div className="rounded-xl border p-3 overflow-auto max-h-80">
          <NodeView node={parsed} />
        </div>
      )}
    </div>
  );
}
