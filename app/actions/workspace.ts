"use server";

import prisma from "@/prisma/client";

export const getCurrentWorkspaceId = async (
  userId: string
): Promise<string> => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      userId,
    },
  });
  if (!workspace) {
    throw new Error("Workspace not found or access denied");
  }

  // console.log(`Retrieved workspace ID: ${workspace.id}`);
  return workspace.id;
};

export const handleWorkspaceNameUpdate = async (
  workspaceId: string,
  name: string
): Promise<void> => {
  const workspace = await prisma.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      name,
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found or access denied");
  }
};

export const fetchWorkspaceName = async (
  workspaceId: string
): Promise<string> => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    select: {
      name: true,
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  return workspace.name;
};
