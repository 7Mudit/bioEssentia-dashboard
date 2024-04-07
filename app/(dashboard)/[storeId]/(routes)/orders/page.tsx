import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/client";
import Order from "@/models/order.model";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await Order.find({ storeId: params.storeId })
    .populate({
      path: "orderItems", // Assuming 'orderItems' is a field in Order that references OrderItem documents
      populate: { path: "productId" }, // Further populate the 'product' within each OrderItem
    })
    .sort({ createdAt: -1 }); // Sorting by creation date in descending order

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item._id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem: any) => orderItem.productId.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total: any, item: any) => {
        return total + Number(item.productId.price);
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
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
