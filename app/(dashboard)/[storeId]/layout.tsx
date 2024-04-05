import Navbar from "@/components/navbar";
import { connectToDb } from "@/lib/mongoose";
import Store from "@/models/store.model";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  await connectToDb();
  const store = await Store.findOne({
    _id: params.storeId, // Mongoose uses _id for the primary key
    userId: userId, // Assuming userId is stored directly in the store document
  });
  if (!store) {
    redirect("/");
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
