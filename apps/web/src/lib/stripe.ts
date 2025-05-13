import { env } from "@/env";
import { prisma, SubscriptionStatus } from "@packages/prisma";
import { redirect } from "next/navigation";
import Stripe from "stripe";

import { SubscriptionSchema } from "./trpc/schema/subscription";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2025-04-30.basil' });

export async function createCheckoutSession({ subscription, priceId }: {
  subscription: SubscriptionSchema;
  priceId: string;
}) {
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${env.APP_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL}/pricing`,
    customer: subscription.stripeCustomerId || undefined,
    client_reference_id: subscription.id,
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 14
    }
  });

  return stripeSession.url!
}

export async function createCustomerPortalSession(subscription: SubscriptionSchema, slug: string) {
  if (!subscription.stripeCustomerId || !subscription.stripeProductId) {
    redirect('/pricing');
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(subscription.stripeProductId);
    if (!product.active) {
      throw new Error("Team's product is not active in Stripe");
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true
    });
    if (prices.data.length === 0) {
      throw new Error("No active prices found for the team's product");
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your subscription'
      },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price', 'quantity', 'promotion_code'],
          proration_behavior: 'create_prorations',
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id)
            }
          ]
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'other',
            ],
          },
        },
        payment_method_update: {
          enabled: true,
        },
      },
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${env.APP_URL}/w/${slug}/settings/billing`,
    configuration: configuration.id
  });
}

export async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const workspace = await prisma.workspace.findFirst({
    where: { subscription: { stripeCustomerId: customerId } },
    include: { subscription: true }
  });

  if (!workspace || !workspace.subscription) {
    console.error('Workspace not found for Stripe customer:', customerId);
    return;
  }

  if (status === 'active' || status === 'trialing') {
    const plan = subscription.items.data[0]?.plan;
    await prisma.subscription.update({
      where: { id: workspace.subscription.id },
      data: {
        stripeSubscriptionId: subscriptionId,
        stripeProductId: plan?.product as string,
        plan: (plan?.product as Stripe.Product).name,
        status: status === "active" ? SubscriptionStatus.ACTIVE : SubscriptionStatus.TRIALING
      }
    })
  } else if (status === 'canceled' || status === 'unpaid') {
    await prisma.subscription.update({
      where: { id: workspace.subscription.id },
      data: {
        stripeSubscriptionId: null,
        stripeProductId: null,
        plan: "",
        status: status === "canceled" ? SubscriptionStatus.CANCELLED : SubscriptionStatus.INCOMPLETE_EXPIRED
      }
    });
  }
}

export async function getStripePrices() {
  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'recurring'
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === 'string' ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: price.recurring?.interval,
    trialPeriodDays: price.recurring?.trial_period_days
  }));
}

export async function getStripeProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price']
  });

  return products.data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId:
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price?.id
  }));
}
