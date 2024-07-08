"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Feedbackcolumns, FeedbackColumn } from "./column";

interface FeedbackClientProps {
  data: FeedbackColumn[];
}

export const FeedbackClient: React.FC<FeedbackClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  console.log("this is data : ", data);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Feedbacks (${data.length})`}
          description="Manage feedbacks for your product"
        />
        <Button
          onClick={() =>
            router.push(
              `/${params.storeId}/feedbacks/productFeedbacks/${params.productId}/new`
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="userName" columns={Feedbackcolumns} data={data} />
    </>
  );
};
