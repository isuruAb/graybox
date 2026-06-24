import Image from "next/image";
import Link from "next/link";

import { AlertsDashboard } from "@/components/AlertsDashboard";

const AlertsPage = () => {
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
          <Link
            href="/admin"
            className="text-16-semibold text-dark-700 transition-colors hover:text-white"
          >
            Admin Dashboard
          </Link>
          <Link href="/admin/alert" className="text-16-semibold text-white">
            Alerts
          </Link>
        </nav>
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

        <AlertsDashboard />
      </main>
    </div>
  );
};

export default AlertsPage;
