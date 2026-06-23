import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { alertColumns } from "@/components/table/alertColumns";
import { DataTable } from "@/components/table/DataTable";
import { getAlerts } from "@/lib/actions/alert.actions";

const AlertsPage = async () => {
  const alerts = await getAlerts();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/download.png"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Patient Alerts</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <div className="flex w-full items-center justify-between gap-4">
            <h1 className="header">Alerts Dashboard</h1>
            <Link
              href="/admin/alert/create"
              className="shad-primary-btn shrink-0 rounded-md px-4 py-2 text-sm font-semibold"
            >
              Create Alert
            </Link>
          </div>
          <p className="text-dark-700">
            Monitor and review patient alerts across the system
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="cancelled"
            count={alerts?.criticalCount ?? 0}
            label="Critical alerts"
            icon={"/assets/icons/cancelled.svg"}
          />
          <StatCard
            type="pending"
            count={alerts?.openCount ?? 0}
            label="Open alerts"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="appointments"
            count={alerts?.resolvedCount ?? 0}
            label="Resolved alerts"
            icon={"/assets/icons/check.svg"}
          />
        </section>

        <DataTable columns={alertColumns} data={alerts?.documents ?? []} />
      </main>
    </div>
  );
};

export default AlertsPage;
