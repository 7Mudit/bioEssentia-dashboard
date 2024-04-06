"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, FlavourColumn } from "./columns";

interface FlavourClientProps {
  data: FlavourColumn[];
}

export const FlavourClient: React.FC<FlavourClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Flavours (${data.length})`}
          description="Manage Flavours for your products"
        />
        <Button onClick={() => router.push(`/${params.storeId}/flavours/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Flavours" />
      <Separator />
      <ApiList entityName="flavours" entityIdName="flavourId" />
    </>
  );
};
