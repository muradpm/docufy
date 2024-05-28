import { Separator } from "@/components/ui/separator";
import TeamForm from "./team-form";
import { getCurrentWorkspaceId } from "@/app/actions/workspace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  fetchUsersByWorkspace,
  fetchPendingInvitationsByWorkspace,
} from "@/app/actions/team-member";

export default async function SettingsTeamPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User ID is undefined.");
  }

  const workspaceId = await getCurrentWorkspaceId(userId);
  const users = await fetchUsersByWorkspace(workspaceId);
  const pendingInvitations = await fetchPendingInvitationsByWorkspace(
    workspaceId
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Team</h3>
        <p className="text-sm text-muted-foreground">
          Manage your team members and invite new ones.
        </p>
      </div>
      <Separator />
      <TeamForm
        initialUsers={users}
        initialPendingInvitations={pendingInvitations}
      />
    </div>
  );
}
