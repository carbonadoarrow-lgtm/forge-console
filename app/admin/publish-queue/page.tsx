export default function AdminPublishQueue() {
  const queueItems = [
    { id: 1, name: "Market Analysis Q4", type: "Report", status: "pending", scheduled: "2025-12-20 14:00" },
    { id: 2, name: "Infrastructure Update", type: "Skill", status: "processing", scheduled: "2025-12-19 16:30" },
    { id: 3, name: "Daily Digest", type: "Mission", status: "queued", scheduled: "2025-12-19 18:00" },
    { id: 4, name: "Weekly Review", type: "Report", status: "completed", scheduled: "2025-12-18 10:00" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "queued": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">LETO Publish Queue</h1>
      <p className="text-muted-foreground mb-6">
        Manage scheduled publications and content releases.
      </p>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted px-4 py-3 border-b flex items-center justify-between">
          <h2 className="font-semibold">Publication Queue</h2>
          <button className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
            Schedule New
          </button>
        </div>
        <div className="divide-y">
          {queueItems.map((item) => (
            <div key={item.id} className="px-4 py-3 flex items-center justify-between hover:bg-muted/50">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{item.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                    {item.type}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Scheduled: {item.scheduled}
                </div>
              </div>
              <div className="flex gap-2">
                {item.status === "pending" && (
                  <>
                    <button className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                      Publish Now
                    </button>
                    <button className="px-3 py-1 text-sm rounded-md border hover:bg-muted">
                      Edit
                    </button>
                  </>
                )}
                {item.status === "processing" && (
                  <button className="px-3 py-1 text-sm rounded-md border hover:bg-muted">
                    View Logs
                  </button>
                )}
                <button className="px-3 py-1 text-sm rounded-md border border-destructive/20 text-destructive hover:bg-destructive/10">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
