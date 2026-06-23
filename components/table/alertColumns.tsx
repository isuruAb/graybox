"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { AlertSeverityBadge, AlertStatusBadge } from "@/components/AlertBadge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { Alert } from "@/types/appwrite.types";

export const alertColumns: ColumnDef<Alert>[] = [
  {
    accessorKey: "$id",
    header: "Alert ID",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.$id}</p>;
    },
  },
  {
    accessorKey: "patientName",
    header: "Patient Name",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.patientName}</p>;
    },
  },
  {
    accessorKey: "alertType",
    header: "Alert Type",
    cell: ({ row }) => {
      return <p className="text-14-regular">{row.original.alertType}</p>;
    },
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => {
      return (
        <div className="min-w-[115px]">
          <AlertSeverityBadge severity={row.original.severity} />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="min-w-[115px]">
          <AlertStatusBadge status={row.original.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "$createdAt",
    header: "Created Date",
    cell: ({ row }) => {
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(row.original.$createdAt).dateTime}
        </p>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      return (
        <Link href={`/admin/alert/${row.original.$id}/edit`}>
          <Button size="sm" className="shad-gray-btn">
            Edit
          </Button>
        </Link>
      );
    },
  },
];
