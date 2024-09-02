"use client";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, UserColumn } from "./columns";

interface UserClientProps {
  data: UserColumn[];
}

export const UserClient: React.FC<UserClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Users (${data.length})`} description="All Users " />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for users" />
      <Separator />
      <ApiList entityName="users" entityIdName="userId" />
    </>
  );
};
