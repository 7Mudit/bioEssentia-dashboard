import { Order } from "@/models";

export const getSalesCount = async (storeId: string) => {
  const salesCount = await Order.countDocuments({
    storeId: storeId,
    status: "Completed", // Ensure consistency with the status field
  });
  return salesCount;
};
