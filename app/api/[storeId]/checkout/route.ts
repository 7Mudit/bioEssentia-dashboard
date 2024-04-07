import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { Order, OrderItem, Product } from "@/models";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const products = await Product.find({
    _id: { $in: productIds },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product: any) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "INR",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
    });
  });
  const order = await Order.create({
    storeId: params.storeId,
    isPaid: false,
  });

  const orderItems = await Promise.all(
    productIds.map((productId: any) =>
      OrderItem.create({
        orderId: order._id,
        productId: productId,
      })
    )
  );

  const orderItemIds = orderItems.map((orderItem) => orderItem._id);

  const updatedOrder = await Order.findByIdAndUpdate(
    order._id,
    { $push: { orderItems: { $each: orderItemIds } } },
    { new: true }
  ).populate("orderItems");

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order._id.toString(),
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
