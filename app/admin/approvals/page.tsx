export default function AdminApprovals() {
  const pendingApprovals = [
    { id: 1, type: "Mission", name: "Q4 Analysis Pipeline", requester: "Alex Chen", date: "2025-12-18" },
    { id: 2, type: "Skill", name: "Data Validation v2", requester: "Sam Rivera", date: "2025-12-17" },
    { id: 3, type: "Report", name: "Weekly Performance", requester: "Jordan Lee", date: "2025-12-16" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">LETO Approvals</h1>
      <p className="text-muted-foreground mb-6">
        Review and approve pending requests from circle members.
      </p>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted px-4 py-3 border-b">
          <h2 className="font-semibold">Pending Approvals ({pendingApprovals.length})</h2>
        </div>
        <div className="divide-y">
          {pendingApprovals.map((approval) => (
            <div key={approval.id} className="px-4 py-3 flex items-center justify-between hover:bg-muted/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{approval.name}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {approval.type}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Requested by {approval.requester} • {approval.date}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                  Approve
                </button>
                <button className="px-3 py-1 text-sm rounded-md border hover:bg-muted">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
