import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { env } from "@/env.mjs";
import prisma from "@/prisma/client";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // console.log(`Received Stripe event: ${event.type} with ID: ${event.id}`);

  const session = event.data.object as Stripe.Checkout.Session;
  // console.log("Checkout session object:", session);

  if (event.type === "checkout.session.completed") {
    // console.log("Handling checkout.session.completed event:", event);

    // Retrieve the subscription details from Stripe
    if (session.subscription) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        // console.log(
        //   `Subscription ID: ${subscription.id}, Customer ID: ${subscription.customer}`
        // );

        await prisma.user.update({
          where: {
            id: session?.metadata?.userId,
          },
          data: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            stripeIsActive: true,
          },
        });
        // console.log("User subscription updated successfully");
      } catch (error) {
        // console.error("Error updating user subscription:", error);
      }
    } else {
      // console.log("No subscription ID associated with this session.");
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update the price id and set the new period end
    await prisma.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.user.update({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
      data: {
        stripeSubscriptionId: null,
        stripeCurrentPeriodEnd: null,
        stripeIsActive: false,
      },
    });
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new Response(null, { status: 200 });
}
