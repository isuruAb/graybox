"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { alertKeys } from "@/hooks/useAlerts";
import { Alert } from "@/types/appwrite.types";

export const EditAlertButton = ({ alert }: { alert: Alert }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleEdit = () => {
    queryClient.setQueryData(alertKeys.detail(alert.$id), alert);
    router.push(`/admin/alert/${alert.$id}/edit`);
  };

  return (
    <Button size="sm" className="shad-gray-btn" onClick={handleEdit}>
      Edit
    </Button>
  );
};
