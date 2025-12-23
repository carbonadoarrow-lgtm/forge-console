import Link from "next/link";
import NewRunForm from "@/components/forge/autonomy/NewRunForm";

export const dynamic = "force-dynamic";

export default function NewBuilderRunPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link className="text-sm underline" href="/forge/builder">
          Back to runs
        </Link>
      </div>

      <div className="text-xl font-semibold">New Builder Run</div>
      <NewRunForm />
    </div>
  );
}
