import Store from "@/models/store.model";
import React from "react";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const store = await Store.findOne({
    _id: params.storeId,
  });

  return <div>Active store : {store?.name}</div>;
};

export default DashboardPage;
