import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
export type OrderColumn = {
  id: string;
  clerkId: string;
  products: string;
  totalPrice: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "clerkId",
    header: "Clerk ID",
    cell: ({ row }) => (
      <Link
        href={`orders/${row.original.id}`}
        className="text-blue-600 hover:underline"
      >
        {row.original.clerkId}
      </Link>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "status",
    header: "Payment Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
];
