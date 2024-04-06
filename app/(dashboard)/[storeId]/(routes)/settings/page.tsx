import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { SettingsForm } from "./components/settings-form";
import Store from "@/models/store.model";

const SettingsPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await Store.findOne({
    _id: params.storeId, // Use _id for MongoDB documents
    userId: userId, // Assuming 'userId' is a field in your document
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={JSON.parse(JSON.stringify(store))} />
      </div>
    </div>
  );
};

export default SettingsPage;
