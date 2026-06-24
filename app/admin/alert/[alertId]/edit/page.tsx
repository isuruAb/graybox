import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AlertForm } from "@/components/forms/AlertForm";

const EditAlertPage = ({ params: { alertId } }: SearchParamProps) => {
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

        <p className="text-16-semibold">Edit Alert</p>
      </header>

      <main className="admin-main">
        <Link
          href="/admin/alert"
          className="text-14-regular flex w-full max-w-screen-sm items-center gap-1.5 self-start text-dark-700 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Alert Dashboard
        </Link>

        <section className="w-full max-w-screen-sm space-y-4">
          <h1 className="header">Edit Alert</h1>
          <p className="text-dark-700">Update the patient alert details</p>
        </section>

        <section className="w-full max-w-screen-sm">
          <AlertForm alertId={alertId} />
        </section>
      </main>
    </div>
  );
};

export default EditAlertPage;
