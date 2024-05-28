/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { hobbyPlan, proPlan } from "@/config/subscription";
import type { UserSubscriptionPlan } from "@/types";
import prisma from "@/prisma/client";

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is on the Pro plan
  const isPro = Boolean(
    (user.stripePriceId === proPlan.stripePriceId ||
      user.stripePriceId === proPlan.stripeAnnuallyPriceId) &&
      user.stripeCurrentPeriodEnd &&
      user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now()
  );

  // Check if user is on the Hobby plan
  const isHobby = Boolean(
    (user.stripePriceId === hobbyPlan.stripePriceId ||
      user.stripePriceId === hobbyPlan.stripeAnnuallyPriceId) &&
      user.stripeCurrentPeriodEnd &&
      user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now()
  );

  const plan = isPro
    ? user.stripePriceId === proPlan.stripeAnnuallyPriceId
      ? { ...proPlan, isAnnually: true }
      : proPlan
    : user.stripePriceId === hobbyPlan.stripeAnnuallyPriceId
    ? { ...hobbyPlan, isAnnually: true }
    : hobbyPlan;

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime()!,
    isPro,
    isHobby,
    stripePriceId: user.stripePriceId ?? "",
  };
}
