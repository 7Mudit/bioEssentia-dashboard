import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/client";
import Order from "@/models/order.model";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await Order.find()
    .populate({
      path: "products.productId", // Assuming 'products.productId' is the reference field to Product
      populate: { path: "storeId categoryId sizeId flavourId images" }, // Populating related fields within Product
    })
    .sort({ createdAt: -1 }); // Sorting by creation date in descending order

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item._id.toString(),
    clerkId: item.clerkId,
    products: item.products
      .map((product: any) => {
        const productDetails = product.productId;
        return `${productDetails.name} (${
          product.quantity
        } x ${productDetails.sizeId
          .map((size: any) => size.name)
          .join(", ")} ${productDetails.flavourId
          .map((flavor: any) => flavor.name)
          .join(", ")})`;
      })
      .join(", "),
    totalPrice: formatter.format(item.totalAmount),
    status: item.status,
    createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
    updatedAt: format(new Date(item.updatedAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={JSON.parse(JSON.stringify(formattedOrders))} />
      </div>
    </div>
  );
};

export default OrdersPage;
