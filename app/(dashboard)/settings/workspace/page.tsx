import { Separator } from "@/components/ui/separator";
import { WorkspaceForm } from "./workspace-form";
import {
  getCurrentWorkspaceId,
  fetchWorkspaceName,
} from "@/app/actions/workspace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const revalidate = 0;

export default async function SettingsWorkspacePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User ID is undefined.");
  }

  const workspaceId = await getCurrentWorkspaceId(userId);
  const initialWorkspaceName = await fetchWorkspaceName(workspaceId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Workspace</h3>
        <p className="text-sm text-muted-foreground">
          Manage your workspace settings and invite team members.
        </p>
      </div>
      <Separator />
      <WorkspaceForm initialWorkspaceName={initialWorkspaceName} />
    </div>
  );
}
