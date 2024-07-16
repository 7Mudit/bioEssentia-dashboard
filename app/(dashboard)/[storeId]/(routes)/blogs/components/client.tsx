"use client";



import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Productcolumns, ProductColumn } from "./column";

interface productClientProps {
  data: ProductColumn[];
}

export const ProductClient: React.FC<productClientProps> = ({ data }) => {
 

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage feedbacks for your products"
        />
        
      </div>
      <Separator />
      <DataTable searchKey="name" columns={Productcolumns} data={data} />
    
    </>
  );
};
