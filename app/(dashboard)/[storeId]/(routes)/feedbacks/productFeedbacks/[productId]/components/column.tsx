"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type FeedbackColumn = {
  id: string;
  userName: string;
  feedback: string;
  rating: number;
  createdAt: string;
  approved: boolean;
};

export const Feedbackcolumns: ColumnDef<FeedbackColumn>[] = [
  {
    accessorKey: "userName",
    header: "User Name",
  },
  {
    accessorKey: "feedback",
    header: "Comment",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "approved",
    header: "Approved",
    cell: ({ row }) => (
      <span
        className={row.original.approved ? "text-green-600" : "text-red-600"}
      >
        {row.original.approved ? "Visible" : "Not Visible"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
