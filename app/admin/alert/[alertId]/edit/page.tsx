import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AlertForm } from "@/components/forms/AlertForm";
import { getAlert } from "@/lib/actions/alert.actions";
import { Alert } from "@/types/appwrite.types";

const EditAlertPage = async ({
  params: { alertId },
}: SearchParamProps) => {
  //TODO: Get it from the globalstate
  const alert = await getAlert(alertId);

  if (!alert) notFound();

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
        <section className="w-full max-w-[640px] space-y-4">
          <h1 className="header">Edit Alert</h1>
          <p className="text-dark-700">Update the patient alert details</p>
        </section>

        <section className="w-full max-w-[640px]">
          <AlertForm alert={alert as Alert} />
        </section>
      </main>
    </div>
  );
};

export default EditAlertPage;
