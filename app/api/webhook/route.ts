import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import mongoose from "mongoose";
import { Order } from "@/models";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    const orderId = new mongoose.Types.ObjectId(session.metadata!.orderId);
    // Update the order and set isPaid, address, and phone
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        address: addressString,
        phone: session.customer_details?.phone || "",
      },
      { new: true } // Return the updated document
    ).populate("orderItems"); // Populate orderItems to access their productIds
    if (!updatedOrder) {
      console.log("Order not found");
      return;
    }
    // // Extract productIds from the populated orderItems
    // const productIds = updatedOrder.orderItems.map(item => item.productId);

    // // Update products to set isArchived true
    // await Product.updateMany(
    //   { _id: { $in: productIds } },
    //   { isArchived: true }
    // );
  }

  return new NextResponse(null, { status: 200 });
}
