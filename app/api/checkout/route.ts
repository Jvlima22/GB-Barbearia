import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/_lib/auth"
import { stripe } from "@/app/_lib/stripe"
import { db } from "@/app/_lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { itemId, type, quantity = 1, metadata = {} } = await req.json()

    if (!itemId || !type) {
      return new NextResponse("Missing parameters", { status: 400 })
    }

    let name = ""
    let price = 0
    let description = ""

    if (type === "SERVICE") {
      const service = await db.service.findUnique({ where: { id: itemId } })
      if (!service)
        return new NextResponse("Service not found", { status: 404 })
      name = service.name
      price = Number(service.price)
      description = service.description
    } else if (type === "PRODUCT") {
      const product = await db.product.findUnique({ where: { id: itemId } })
      if (!product)
        return new NextResponse("Product not found", { status: 404 })
      name = product.name
      price = Number(product.price)
      description = product.description
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name,
              description,
            },
            unit_amount: Math.round(price * 100), // Stripe uses cents
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/bookings`,
      cancel_url: `${appUrl}/`,
      metadata: {
        userId: (session.user as any).id,
        itemId,
        type,
        quantity,
        ...metadata,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("[STRIPE_CHECKOUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
