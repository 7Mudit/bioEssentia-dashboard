import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import Store from "@/models/store.model";
import { connectToDb } from "@/lib/mongoose";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  await connectToDb();
  const store = await Store.findOne({ userId: userId });

  if (store) {
    redirect(`/${store._id}`);
  }

  return <>{children}</>;
}
