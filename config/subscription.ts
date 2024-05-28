import type { SubscriptionPlan } from "@/types";

export const hobbyPlan: SubscriptionPlan = {
  name: "Hobby",
  description: "Upgrade to Pro plan for unlimited features.",
  stripePriceId: process.env.STRIPE_HOBBY_PLAN_ID as string,
  stripeAnnuallyPriceId: process.env.STRIPE_HOBBY_ANNUALLY_PLAN_ID as string,
};

export const proPlan: SubscriptionPlan = {
  name: "Pro",
  description: "Pro plan has unlimited features.",
  stripePriceId: process.env.STRIPE_PRO_PLAN_ID as string,
  stripeAnnuallyPriceId: process.env.STRIPE_PRO_ANNUALLY_PLAN_ID as string,
};
