"use server";

import prisma from "@/prisma/client";

export const handleUserDelete = async (userId: string) => {
  await prisma.session.deleteMany({
    where: {
      userId: userId,
    },
  });

  const userDelete = await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  return userDelete;
};
