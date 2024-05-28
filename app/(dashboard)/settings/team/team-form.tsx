"use client";

import React, { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserInvitationForm } from "@/components/user-invitation-form";
import { Role } from "@prisma/client";
import { TabsTrigger, TabsList, Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TeamActions } from "@/components/team-actions";
import { TeamInvitationActions } from "@/components/invitation-actions";
import { TeamMemberSearch } from "@/components/team-member-search";
import { format } from "date-fns";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";

type TeamFormProps = {
  initialUsers: any[];
  initialPendingInvitations: any[];
};

export default function TeamMembers({
  initialUsers,
  initialPendingInvitations,
}: TeamFormProps) {
  const [pendingInvitations, setPendingInvitations] = useState(
    initialPendingInvitations
  );
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvitationDeleted = (invitationId: string) => {
    setPendingInvitations((currentInvitations) =>
      currentInvitations.filter((invitation) => invitation.id !== invitationId)
    );
  };

  return (
    <>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Invite new users
        </label>
        <p className="text-[0.8rem] text-muted-foreground">
          Workspace administrators can add, manage, and remove members.
        </p>
      </div>
      <UserInvitationForm />
      <TeamMemberSearch onSearch={(term) => setSearchTerm(term)} />
      <div className="mt-8 mb-4">
        <Tabs defaultValue="existing" className="space-y-4">
          <TabsList>
            <TabsTrigger value="existing">Existing users</TabsTrigger>
            <TabsTrigger value="pending">Pending invitations</TabsTrigger>
          </TabsList>
          <TabsContent value="existing" className="space-y-4">
            <Suspense fallback={<Skeleton className="h-64 rounded-lg" />}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-gray-500">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        <Badge
                          variant={
                            user.role === Role.Admin ? "default" : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <TeamActions user={user} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Suspense>
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            <Suspense fallback={<Skeleton className="h-64 rounded-lg" />}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>{invitation.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{invitation.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(invitation.createdAt), "PP")}
                      </TableCell>
                      <TableCell>
                        <TeamInvitationActions
                          user={invitation}
                          onInvitationDeleted={handleInvitationDeleted}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
