"use client";
import { useEffect, useState } from "react";
import { fetchOrderById } from "@/lib/actions/order.action";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Size {
  sizeId: { name: string };
  price: number;
  fakePrice: number;
}

interface Product {
  productId: {
    _id: string;
    name: string;
    sizes: Size[];
    images: { url: string }[];
  };
  quantity: number;
  flavor: string;
  size: string; // This is the sizeId, not the size object itself
}

interface Order {
  clerkId: string;
  products: Product[];
  totalAmount: number;
  status: "Pending" | "Completed" | "Failed";
  createdAt: Date;
  updatedAt: Date;
  merchantTransactionId: string;
  coupon?: {
    code: string;
    discountPercentage: number;
  };
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

export default function OrderPage({ params }: { params: { id: string } }) {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchOrderById(params.id)
        .then((data) => {
          if (data) {
            setOrderData(JSON.parse(data));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [params.id]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  const { order, user, address } = orderData;

  const subtotal = order.products.reduce((total, product) => {
    console.log(product);
    const selectedSize = product.productId.sizes.find(
      (size) => size.sizeId.name === product.size
    );
    return total + (selectedSize ? selectedSize.price * product.quantity : 0);
  }, 0);

  const discountAmount = order.coupon
    ? (subtotal * order.coupon.discountPercentage) / 100
    : 0;

  const totalAmount = subtotal - discountAmount;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="grid gap-8">
          <div className="grid gap-4">
            {order.products.map((product, index) => {
              const selectedSize = product.productId.sizes.find(
                (size) => size.sizeId.name === product.size
              );
              const price = selectedSize ? selectedSize.price : 0;
              const fakePrice = selectedSize ? selectedSize.fakePrice : 0;

              return (
                <div key={index} className="flex items-center gap-4">
                  {product.productId.images.length > 0 ? (
                    <Image
                      src={product.productId.images[0].url}
                      alt="Product Image"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-200 rounded-md">
                      No Image
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-medium">
                      {product.productId.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Quantity: {product.quantity}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Flavor: {product.flavor}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Size: {product.size}
                    </p>
                    <p className="font-medium">
                      Price: ₹{price.toFixed(2)}
                      {fakePrice > price && (
                        <span className="line-through ml-2 text-gray-500">
                          ₹{fakePrice.toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
              <p className="font-medium">₹{subtotal.toFixed(2)}</p>
            </div>

            {order.coupon && (
              <div className="flex items-center justify-between">
                <p className="text-gray-500 dark:text-gray-400">
                  Coupon Applied
                </p>
                <p className="font-medium">
                  {order.coupon.code} - {order.coupon.discountPercentage}% Off
                </p>
              </div>
            )}
            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-lg font-medium">Total</p>
              <p className="text-lg font-medium">₹{totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Order Status
                  </p>
                  <p className="font-medium">{order.status}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Transaction ID
                  </p>
                  <p className="font-medium">{order.merchantTransactionId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
