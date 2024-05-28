import { MainNav } from "@/components/main-nav";
import WorkspaceSwitcher from "@/components/workspace-switcher";
import { Search } from "@/components/search-nav";
import { CommandMenu } from "@/components/command-menu";
import { FeedbackIssue } from "@/components/feedback-issue";
import { UserNav } from "@/components/user-nav";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  getCurrentWorkspaceId,
  fetchWorkspaceName,
} from "@/app/actions/workspace";

interface OverviewLayoutProps {
  children: React.ReactNode;
}

export default async function OverviewLayout({
  children,
}: OverviewLayoutProps) {
  const session = await getServerSession(authOptions);
  const user = await getCurrentUser();

  if (!user || !user.stripeIsActive) {
    redirect("/pricing");
  }

  if (!session) {
    redirect("/login");
  }
  const workspaceId = await getCurrentWorkspaceId(user.id);
  const workspaceName = await fetchWorkspaceName(workspaceId);

  return (
    <>
      <div className="border-b sticky top-0 z-50 bg-background">
        <div className="flex h-16 items-center px-4">
          <div className="lg:block hidden">
            <WorkspaceSwitcher workspaceName={workspaceName} />
          </div>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <FeedbackIssue />
            <UserNav />
            <CommandMenu />
          </div>
        </div>
      </div>
      <div>{children}</div>
    </>
  );
}
