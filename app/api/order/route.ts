import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { type CartItemWithPriceRelations } from "@/lib/api/cartHelpers";
import { z } from "zod";
import { calculateDealPrice, getDealPercent } from "@/lib/deals";

const orderSchema = z.object({
  address: z.string().trim().min(5).max(500),
  phone: z.string().trim().min(7).max(30),
  notes: z.string().trim().max(500).optional().default(""),
  paymentMethod: z.enum(["COD", "ONLINE"]),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = orderSchema.safeParse(await req.json());
    if (!body.success) {
      return NextResponse.json({ error: "Invalid order details" }, { status: 400 });
    }
    const { address, phone, notes, paymentMethod } = body.data;

    const order = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true, roast: true, grindOption: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      const checkoutNow = new Date();
      const deal = await tx.featuredDeal.findFirst({
        where: { id: "primary", isActive: true, startsAt: { lte: checkoutNow }, endsAt: { gt: checkoutNow } },
        include: { products: { select: { productId: true } } },
      });
      const itemPrice = (item: (typeof cart.items)[number]) =>
        calculateDealPrice(item as CartItemWithPriceRelations, getDealPercent(deal, item.productId));

      const totalPrice = cart.items.reduce((total, item) => {
        return total + itemPrice(item) * item.quantity;
      }, 0);

      const createdOrder = await tx.order.create({
        data: {
          userId,
          totalPrice: Number(totalPrice.toFixed(2)),
          address,
          phone,
          notes,
          status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              basePrice: itemPrice(item),
              roastId: item.roastId,
              grindOptionId: item.grindOptionId,
            })),
          },
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return createdOrder;
    });

    if (paymentMethod === "ONLINE") {
      return NextResponse.json({
        success: true,
        redirectUrl: `/fake-payment?orderId=${order.id}`,
        orderId: order.id,
      });
    }

    return NextResponse.json({
      success: true,
      redirectUrl: `/order/success?orderId=${order.id}`,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    if (error instanceof Error && error.message === "Cart is empty") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
