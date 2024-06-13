"use client";
import { useEffect, useState } from "react";
import { fetchOrderById } from "@/lib/actions/order.action";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Order {
  clerkId: string;
  products: Product[];
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  merchantTransactionId: string;
}

interface Product {
  productId: {
    name: string;
    price: number;
    images: { url: string }[];
  };
  quantity: number;
  flavor: string;
  size: string;
}

interface User {
  name: string;
  email: string;
  picture: string;
}

interface Address {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
}

interface OrderData {
  order: Order;
  user: User;
  address: Address;
}

export default function OrderPage({ params }: any) {
  const orderId = params.id;

  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId as string)
        .then((data) => {
          if (data) {
            setOrderData(JSON.parse(data));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [orderId]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  const { order, user, address } = orderData;
  console.log(order);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="grid gap-8">
          <div className="grid gap-4">
            {order.products.map((product, index) => (
              <div key={index} className="flex items-center gap-4">
                <Image
                  src={product.productId.images[0].url}
                  alt="Product Image"
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
                <div>
                  <h2 className="text-lg font-medium">
                    {product?.productId.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Quantity: {product?.quantity}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Flavor: {product?.flavor}
                  </p>
                  <p className="font-medium">
                    ₹{product.productId.price.toFixed(2)} per item
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
              <p className="font-medium">₹{order?.totalAmount.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 dark:text-gray-400">Shipping</p>
              <p className="font-medium">₹0</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 dark:text-gray-400">Tax</p>
              <p className="font-medium">₹0</p>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-lg font-medium">Total</p>
              <p className="text-lg font-medium">
                ₹{order?.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Customer Name
                  </p>
                  <p className="font-medium">{address?.name ?? user?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Shipping Address
                  </p>
                  <p>
                    {address?.addressLine1}
                    <br />
                    {address?.addressLine2 && (
                      <>
                        {address?.addressLine2}
                        <br />
                      </>
                    )}
                    {address?.city}, {address?.state} {address?.postalCode}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Email</p>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Phone</p>
                  <p>{address?.phoneNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
