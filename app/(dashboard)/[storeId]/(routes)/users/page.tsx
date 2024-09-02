import { format } from "date-fns";

import { UserColumn } from "./components/columns";
import { UserClient } from "./components/client";
import { connectToDb } from "@/lib/mongoose";
import { User } from "@/models";

const UsersPage = async ({ params }: { params: { storeId: string } }) => {
  await connectToDb();
  const users = await User.find({ storeId: params.storeId }).sort({
    joinedAt: -1,
  });

  const formattedUsers: UserColumn[] = users.map((user) => {
    const createdAtFormatted = user.joinedAt
      ? format(new Date(user.joinedAt), "MMMM do, yyyy")
      : "Invalid Date";

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: createdAtFormatted,
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserClient data={JSON.parse(JSON.stringify(formattedUsers))} />
      </div>
    </div>
  );
};

export default UsersPage;
