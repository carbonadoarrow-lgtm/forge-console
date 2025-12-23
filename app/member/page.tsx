export default function MemberHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Circle Member Home</h1>
      <p className="text-muted-foreground mb-6">
        Welcome to the Circle Member area. This space is dedicated to community members.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">My Feed</h3>
          <p className="text-sm text-muted-foreground">
            Latest updates from the circle and community activities.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Reports</h3>
          <p className="text-sm text-muted-foreground">
            Access community reports and shared insights.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Circle Members</h3>
          <p className="text-sm text-muted-foreground">
            Connect with other members of the circle.
          </p>
        </div>
      </div>
    </div>
  );
}
