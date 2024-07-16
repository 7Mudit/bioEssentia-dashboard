"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type SeoColumn = {
  _id: string;
  url: string;
  title: string;
  description: string;
  // h1: string;
  // canonical: string;
  // ogUrl: string;
  // ogTitle: string;
  // ogDescription: string;
  // ogImage: string;
  // seoSchema: string;
  // metaRobots: string;
  // altTag: string;
  // schemaReview: string;
  // keywords: string;
};

export const columns: ColumnDef<SeoColumn>[] = [
  {
    accessorKey: "url",
    header: "Url",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  // {
  //   accessorKey: "url",
  //   header: "Url",
  // },
  // {
  //   accessorKey: "h1",
  //   header: "H1",
  // },
  // {
  //   accessorKey: "canonical",
  //   header: "canonical",
  // },
  // {
  //   accessorKey: "ogUrl",
  //   header: "OgUrl",
  // },
  // {
  //   accessorKey: "ogTitle",
  //   header: "OgTitle",
  // },
  // {
  //   accessorKey: "ogDescription",
  //   header: "OgDescription",
  // },

  // {
  //   accessorKey: "ogImage",
  //   header: "OgImage",
  // },
  // {
  //   accessorKey: "ogDescription",
  //   header: "ogDescription",
  // },
  // {
  //   accessorKey: "seoSchema",
  //   header: "SeoSchema",
  // },
  // {
  //   accessorKey: "metaRobots",
  //   header: "MetaRobots",
  // },
  // {
  //   accessorKey: "altTag",
  //   header: "AltTag",
  // },
  // {
  //   accessorKey: "schemaReview",
  //   header: "SchemaReview",
  // },
  // {
  //   accessorKey: "keywords",
  //   header: "Keywords",
  // },

  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
