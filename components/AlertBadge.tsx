import clsx from "clsx";
import Image from "next/image";

import { AlertSeverityIcon, AlertStatusIcon } from "@/constants";

export const AlertSeverityBadge = ({
  severity,
}: {
  severity: AlertSeverity;
}) => {
  return (
    <div
      className={clsx("status-badge", {
        "bg-red-600": severity === "high",
        "bg-blue-600": severity === "medium",
        "bg-green-600": severity === "low",
      })}
    >
      <Image
        src={AlertSeverityIcon[severity]}
        alt={severity}
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-red-500": severity === "high",
          "text-blue-500": severity === "medium",
          "text-green-500": severity === "low",
        })}
      >
        {severity}
      </p>
    </div>
  );
};

export const AlertStatusBadge = ({ status }: { status: AlertStatus }) => {
  return (
    <div
      className={clsx("status-badge", {
        "bg-blue-600": status === "Open",
        "bg-yellow-600": status === "In Progress",
        "bg-green-600": status === "Resolved",
      })}
    >
      <Image
        src={AlertStatusIcon[status]}
        alt={status}
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold", {
          "text-blue-500": status === "Open",
          "text-yellow-500": status === "In Progress",
          "text-green-500": status === "Resolved",
        })}
      >
        {status}
      </p>
    </div>
  );
};
