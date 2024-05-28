import { User } from "@prisma/client";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    linkedin: string;
  };
};

export type SubscriptionPlan = {
  name: string;
  description: string;
  stripePriceId: string;
  stripeAnnuallyPriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number;
    isPro: boolean;
    isHobby: boolean;
  };
