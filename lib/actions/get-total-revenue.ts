import { Order } from "@/models";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await Order.find({
    storeId: storeId,
    status: "Completed", // Ensure you are checking for the correct status
  }).populate({
    path: "products.productId", // Correctly populate the nested productId within products array
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.products.reduce((orderSum: any, item: any) => {
      return orderSum + item.productId.price * item.quantity;
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
