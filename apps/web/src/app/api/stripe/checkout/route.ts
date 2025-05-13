import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { prisma, SubscriptionStatus } from "@packages/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    });

    if (!session.customer || typeof session.customer === 'string') {
      throw new Error('Invalid customer data from Stripe.');
    }

    const customerId = session.customer.id;
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      throw new Error('No subscription found for this session.');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    });

    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      throw new Error('No plan found for this subscription.');
    }

    const productId = (plan.product as Stripe.Product).id;

    if (!productId) {
      throw new Error('No product ID found for this subscription.');
    }

    const dbSubscriptionId = session.client_reference_id;
    if (!dbSubscriptionId) {
      throw new Error("No user ID found in session's client_reference_id.");
    }

    const sub = await prisma.subscription.findUnique({
      where: { id: dbSubscriptionId },
    });
    if (!sub) {
      throw new Error('Subscription not found in database.');
    }
    const subscriptionMap = (): SubscriptionStatus => {
      switch (subscription.status) {
        case 'active':
          return SubscriptionStatus.ACTIVE;
        case 'canceled':
          return SubscriptionStatus.CANCELLED;
        case 'incomplete':
          return SubscriptionStatus.INCOMPLETE;
        case 'incomplete_expired':
          return SubscriptionStatus.INCOMPLETE_EXPIRED;
        case 'past_due':
        case 'paused':
          return SubscriptionStatus.PAUSED;
        case 'trialing':
          return SubscriptionStatus.TRIALING;
        case 'unpaid':
          return SubscriptionStatus.INCOMPLETE_EXPIRED;
        default:
          return SubscriptionStatus.INCOMPLETE;
      }
    }
    await prisma.subscription.update({
      where: { id: dbSubscriptionId },
      data: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripeProductId: productId,
        plan: (plan.product as Stripe.Product).name,
        status: subscriptionMap(),
      },
    });

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Error handling successful checkout:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
