"use server";

import prisma from "@/prisma/client";
import { Role } from "@prisma/client";

export async function handleMemberDelete(userId: string) {
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}

export async function handleMemberRoleChange(userId: string, newRole: Role) {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
    });
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw error;
  }
}

export async function fetchUsersByWorkspace(workspaceId: string) {
  return await prisma.user.findMany({
    where: {
      workspaces: {
        some: {
          id: workspaceId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}

export async function fetchPendingInvitationsByWorkspace(workspaceId: string) {
  try {
    return await prisma.invitation.findMany({
      where: {
        workspaceId,
        accepted: false,
      },
    });
  } catch (error) {
    console.error("Error fetching pending invitations:", error);
    throw error;
  }
}

export async function handleSendInvitation(
  workspaceId: string,
  email: string,
  role: Role
) {
  try {
    await prisma.invitation.create({
      data: {
        workspaceId,
        email,
        role,
      },
    });
  } catch (error) {
    console.error("Failed to send invitation:", error);
    throw error;
  }
}

export async function handleInvitationDelete(invitationId: string) {
  try {
    await prisma.invitation.delete({
      where: {
        id: invitationId,
      },
    });
  } catch (error) {
    console.error("Failed to delete invitation:", error);
    throw error;
  }
}
