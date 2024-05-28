import { SidebarNav } from "./sidebar-nav";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  User,
  Users,
  SunMoon,
  MonitorDot,
  Bell,
  CreditCard,
  Building2,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Workspace",
    href: "/settings/workspace",
    icon: <Building2 className="mr-2 h-4 w-4" />,
  },
  {
    title: "Team",
    href: "/settings/team",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    title: "Profile",
    href: "/settings/profile",
    icon: <User className="mr-2 h-4 w-4" />,
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: <SunMoon className="mr-2 h-4 w-4" />,
  },
  {
    title: "Display",
    href: "/settings/display",
    icon: <MonitorDot className="mr-2 h-4 w-4" />,
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: <Bell className="mr-2 h-4 w-4" />,
  },
  {
    title: "Billing",
    href: "/settings/billing",
    icon: <CreditCard className="mr-2 h-4 w-4" />,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const session = await getServerSession(authOptions);

  const user = await getCurrentUser();

  if (!user || !user.stripeIsActive) {
    redirect("/pricing");
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="space-y-0.5">
            <span>
              <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
              <p className="text-muted-foreground">
                Manage your account settings and preferences.
              </p>
            </span>
          </div>
        </div>
        <div className="container mx-auto">
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
