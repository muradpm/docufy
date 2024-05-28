import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { BillingForm } from "./billing-form";
import { DashboardShell } from "@/components/shell";

export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user || !user.stripeIsActive) {
    redirect("/pricing");
  }

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  // If user has an active plan, check cancel status on Stripe
  let isCanceled = false;

  if (
    (subscriptionPlan.isPro || subscriptionPlan.isHobby) &&
    subscriptionPlan.stripeSubscriptionId
  ) {
    const stripePlan = await stripe.subscriptions.retrieve(
      subscriptionPlan.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Billing</h3>
          <p className="text-sm text-muted-foreground">
            Manage billing and your subscription plan.
          </p>
        </div>
        <Separator />
        <div className="mb-4">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Subscription plan
          </label>
          <p className="text-[0.8rem] text-muted-foreground">
            Select the plan you want to use. You can cancel your subscription at
            any time.
          </p>
        </div>
        <BillingForm
          subscriptionPlan={{
            ...subscriptionPlan,
            isCanceled,
          }}
        />
      </div>
    </DashboardShell>
  );
}
