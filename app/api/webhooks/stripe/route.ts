import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/app/_lib/stripe"
import { db } from "@/app/_lib/prisma"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const metadata = session.metadata

    if (!metadata) {
      return new NextResponse("Missing metadata", { status: 400 })
    }

    const { userId, itemId, type, quantity, date } = metadata

    if (type === "SERVICE") {
      if (!date)
        return new NextResponse("Missing date for service", { status: 400 })

      await db.booking.create({
        data: {
          userId,
          serviceId: itemId,
          date: new Date(date),
          paymentStatus: "SUCCEEDED",
          stripeCheckoutSessionId: session.id,
        },
      })
    } else if (type === "PRODUCT") {
      if (!quantity)
        return new NextResponse("Missing quantity for product", { status: 400 })

      await db.purchase.create({
        data: {
          userId,
          productId: itemId,
          quantity: parseInt(quantity),
          paymentStatus: "SUCCEEDED",
          stripeCheckoutSessionId: session.id,
        },
      })
    }
  }

  return new NextResponse(null, { status: 200 })
}
