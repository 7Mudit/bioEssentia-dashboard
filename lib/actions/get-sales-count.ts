import { Order } from "@/models";

export const getSalesCount = async (storeId: string) => {
  const salesCount = await Order.countDocuments({
    storeId: storeId,
    isPaid: true,
  });
  return salesCount;
};
