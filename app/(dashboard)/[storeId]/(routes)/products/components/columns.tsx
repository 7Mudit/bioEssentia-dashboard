"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  category: string;
  size: any;
  flavour: any;
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => (
      <div className="flex flex-col justify-center flex-wrap items-center gap-x-2">
        {row.original.size.map((s: any, index: any) => (
          <span key={index} className="text-sm">
            {s.name}
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "flavour",
    header: "Flavour",
    cell: ({ row }) => (
      <div className="flex flex-col justify-center items-center gap-x-2">
        {row.original.flavour.map((f: any, index: any) => (
          <span key={index} className="text-sm">
            {f.name}
            <div
              className="inline-block h-4 w-4 ml-1 rounded-full border"
              style={{ backgroundColor: f.value }} // Assuming you have a 'value' property for color
            />
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
