import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, address, phone, notes, paymentMethod } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            roast: true,
            grindOption: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((total, item) => {
      let itemPrice = item.product.basePrice;
      if (item.roast?.defaultMultiplier) {
        // Assuming roast doesn't affect price in this simple model,
        // but if it did, we'd calculate it here.
        // The prompt didn't specify roast pricing logic in detail for order,
        // but cartItem has priceAtAddition. Let's use that if available or recalculate.
        // Actually, let's use the current logic: basePrice + grind extra cost.
      }
      if (item.grindOption?.extraCost) {
        itemPrice += item.grindOption.extraCost;
      }
      return total + itemPrice * item.quantity;
    }, 0);

    // Create Order
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        address,
        phone,
        notes,
        status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            basePrice: item.product.basePrice,
            roastId: item.roastId,
            grindOptionId: item.grindOptionId,
          })),
        },
      },
    });

    // Clear Cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
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
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
