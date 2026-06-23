import Image from "next/image";
import Link from "next/link";

import { AlertForm } from "@/components/forms/AlertForm";
import { getPatients } from "@/lib/actions/patient.actions";
import { Patient } from "@/types/appwrite.types";

const CreateAlertPage = async () => {
  const patients = (await getPatients()) as Patient[] | undefined;

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

        <p className="text-16-semibold">Create Alert</p>
      </header>

      <main className="admin-main">
        <section className="w-full max-w-[640px] space-y-4">
          <h1 className="header">New Alert</h1>
          <p className="text-dark-700">
            Create a new patient alert for the system
          </p>
        </section>

        <section className="w-full max-w-[640px]">
          <AlertForm patients={patients ?? []} />
        </section>
      </main>
    </div>
  );
};

export default CreateAlertPage;
