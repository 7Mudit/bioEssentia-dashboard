import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/client";
import Order from "@/models/order.model";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await Order.find()
    .populate({
      path: "products.productId",
      populate: { path: "storeId categoryId images" },
    })
    .sort({ createdAt: -1 });
  const totalOrders = orders.length;

  const formattedOrders: OrderColumn[] = orders.map((item, index) => ({
    id: item._id.toString(),
    clerkId: item.clerkId,
    products: item.products
      .map((product: any) => {
        const productDetails = product.productId;
        return `${productDetails.name} (${product.quantity} x ${product.size} - ${product.flavor})`;
      })
      .join(", "),
    totalPrice: formatter.format(item.totalAmount),
    status: item.status,
    createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
    updatedAt: format(new Date(item.updatedAt), "MMMM do, yyyy"),
    orderNumber: totalOrders - index,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
