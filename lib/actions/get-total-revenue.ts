import { Order } from "@/models";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await Order.find({
    storeId: storeId,
    isPaid: true,
  }).populate({
    path: "products",
    populate: { path: "productId" }, // Assuming each OrderItem has a 'product' path to Product documents
  });
  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum: any, item: any) => {
      return orderSum + item.productId.price;
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
