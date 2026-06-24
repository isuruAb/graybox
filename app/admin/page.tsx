import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

const AdminPage = async () => {
  const appointments = await getRecentAppointmentList();

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

        <nav className="flex items-center gap-6">
          <Link href="/admin" className="text-16-semibold text-white">
            Admin Dashboard
          </Link>
          <Link
            href="/admin/alert"
            className="text-16-semibold text-dark-700 transition-colors hover:text-white"
          >
            Alerts
          </Link>
        </nav>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments?.scheduledCount}
            label="Scheduled appointments"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments?.pendingCount}
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments?.cancelledCount}
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <DataTable columns={columns} data={appointments?.documents ?? []} />
      </main>
    </div>
  );
};

export default AdminPage;
