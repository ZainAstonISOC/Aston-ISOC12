/**
 * ── STRIPE CHECKOUT SESSION API ───────────────────────────────────────────
 *
 * To activate:
 *   1. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local
 *   2. Run: npm install stripe
 *   3. Uncomment the Stripe block below and remove the placeholder response.
 *
 * Endpoint: POST /api/create-checkout-session
 * Body: { amount: number, frequency: "once" | "weekly" | "monthly" }
 *
 * Success redirect: /donate/success?session_id={CHECKOUT_SESSION_ID}
 * Cancel  redirect: /donate/cancel
 */

import { NextRequest, NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_URL           = process.env.NEXT_PUBLIC_APP_URL ?? "https://astonisoc.com";

export async function POST(req: NextRequest) {
  const { amount, frequency } = await req.json();

  if (!amount || typeof amount !== "number" || amount <= 0)
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

  if (!["once", "weekly", "monthly"].includes(frequency))
    return NextResponse.json({ error: "Invalid frequency" }, { status: 400 });

  if (!STRIPE_SECRET_KEY)
    return NextResponse.json(
      { error: "Stripe is not yet configured. Add STRIPE_SECRET_KEY to .env.local." },
      { status: 503 }
    );

  /* ── UNCOMMENT WHEN STRIPE KEYS ARE ADDED ──────────────────────────────
   *
   * import Stripe from "stripe";
   * const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
   *
   * const amountInPence = Math.round(amount * 100);
   * const isRecurring   = frequency !== "once";
   * let session;
   *
   * if (isRecurring) {
   *   const price = await stripe.prices.create({
   *     currency: "gbp",
   *     unit_amount: amountInPence,
   *     recurring: { interval: frequency === "weekly" ? "week" : "month" },
   *     product_data: {
   *       name: `Aston ISOC ${frequency === "weekly" ? "Weekly Jumu'ah" : "Monthly Supporter"} Donation`,
   *     },
   *   });
   *   session = await stripe.checkout.sessions.create({
   *     mode: "subscription",
   *     payment_method_types: ["card"],
   *     line_items: [{ price: price.id, quantity: 1 }],
   *     success_url: `${APP_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
   *     cancel_url:  `${APP_URL}/donate/cancel`,
   *     metadata: { frequency, amount: String(amount) },
   *   });
   * } else {
   *   session = await stripe.checkout.sessions.create({
   *     mode: "payment",
   *     payment_method_types: ["card"],
   *     line_items: [{
   *       quantity: 1,
   *       price_data: {
   *         currency: "gbp",
   *         unit_amount: amountInPence,
   *         product_data: { name: "Aston ISOC One-Time Donation" },
   *       },
   *     }],
   *     success_url: `${APP_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
   *     cancel_url:  `${APP_URL}/donate/cancel`,
   *     metadata: { frequency: "once", amount: String(amount) },
   *   });
   * }
   * return NextResponse.json({ url: session.url });
   * ──────────────────────────────────────────────────────────────────────── */

  return NextResponse.json(
    { error: "Payment processing not yet active." },
    { status: 503 }
  );
}
