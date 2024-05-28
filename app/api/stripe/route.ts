import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { hobbyPlan, proPlan } from "@/config/subscription";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";

const billingUrl = absoluteUrl("/settings/billing");

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session?.user.email) {
      return new NextResponse(null, { status: 403 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id);

    // Extract the planId from the query string
    const url = new URL(req.url);
    const planId = url.searchParams.get("planId");
    const stripePriceId =
      planId === "pro" ? proPlan.stripePriceId : hobbyPlan.stripePriceId;

    if (subscriptionPlan.stripeCustomerId) {
      // The user is on the Pro plan
      // Create a portal session to manage subscription
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      // The user is either on the Hobby plan or not subscribed
      // Create a checkout session to subscribe or upgrade
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: session.user.email,
        line_items: [
          {
            price: stripePriceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: session.user.id,
        },
        subscription_data: {
          trial_period_days: 7,
        },
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }

    // Log the error for server-side debugging
    console.error("Stripe GET Error:", error);

    return new NextResponse(null, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session?.user.email) {
      return new NextResponse(null, { status: 403 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id);

    const body = (await req.json()) as { planId: string; isAnnually: boolean };
    const { planId, isAnnually } = body;

    // Determine the correct Stripe price ID based on the user's current plan
    const stripePriceId =
      planId === "pro"
        ? isAnnually
          ? proPlan.stripeAnnuallyPriceId
          : proPlan.stripePriceId
        : isAnnually
        ? hobbyPlan.stripeAnnuallyPriceId
        : hobbyPlan.stripePriceId;

    if (subscriptionPlan.stripeCustomerId) {
      // The user is on the Pro plan
      // Create a portal session to manage subscription
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    } else {
      // The user is either on the Hobby plan or not subscribed
      // Create a checkout session to subscribe or upgrade
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: session.user.email,
        line_items: [
          {
            price: stripePriceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: session.user.id,
        },
        subscription_data: {
          trial_period_days: 7,
        },
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }

    return new NextResponse(null, { status: 500 });
  }
}
