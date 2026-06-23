"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import {
  AlertSeverityOptions,
  AlertStatusOptions,
  AlertTypes,
} from "@/constants";
import { createAlert, updateAlert } from "@/lib/actions/alert.actions";
import {
  AlertFormValidation,
  AlertStatusEditValidation,
} from "@/lib/validation";
import { Alert, Patient } from "@/types/appwrite.types";

export const AlertForm = ({
  patients = [],
  alert,
}: {
  patients?: Patient[];
  alert?: Alert;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!alert;

  const createForm = useForm<z.infer<typeof AlertFormValidation>>({
    resolver: zodResolver(AlertFormValidation),
    defaultValues: {
      patientName: "",
      alertType: "",
      severity: "medium",
      description: "",
    },
  });

  const editForm = useForm<z.infer<typeof AlertStatusEditValidation>>({
    resolver: zodResolver(AlertStatusEditValidation),
    defaultValues: {
      status: alert?.status ?? "Open",
    },
  });

  const onCreateSubmit = async (
    values: z.infer<typeof AlertFormValidation>
  ) => {
    setIsLoading(true);

    try {
      const newAlert = await createAlert(values);

      if (newAlert) {
        createForm.reset();
        router.push("/admin/alert");
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const onEditSubmit = async (
    values: z.infer<typeof AlertStatusEditValidation>
  ) => {
    setIsLoading(true);

    try {
      if (alert) {
        const updatedAlert = await updateAlert({
          alertId: alert.$id,
          status: values.status,
        });

        if (updatedAlert) {
          router.push("/admin/alert");
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  if (isEdit && alert) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-4 rounded-lg border border-dark-400 bg-dark-300 p-6">
          <div className="space-y-1">
            <p className="shad-input-label">Patient Name</p>
            <p className="text-14-medium text-white">{alert.patientName}</p>
          </div>
          <div className="space-y-1">
            <p className="shad-input-label">Alert Type</p>
            <p className="text-14-regular text-white">{alert.alertType}</p>
          </div>
          <div className="space-y-1">
            <p className="shad-input-label">Severity</p>
            <p className="text-14-regular capitalize text-white">
              {alert.severity}
            </p>
          </div>
          <div className="space-y-1">
            <p className="shad-input-label">Description</p>
            <p className="text-14-regular text-white">{alert.description}</p>
          </div>
        </div>

        <Form {...editForm}>
          <form
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            className="w-full space-y-6"
          >
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={editForm.control}
              name="status"
              label="Status"
              placeholder="Select status"
            >
              {AlertStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </CustomFormField>

            <SubmitButton isLoading={isLoading}>Update Alert</SubmitButton>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <Form {...createForm}>
      <form
        onSubmit={createForm.handleSubmit(onCreateSubmit)}
        className="w-full space-y-6"
      >
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={createForm.control}
          name="patientName"
          label="Patient Name"
          placeholder="Select a patient"
        >
          {patients.map((patient) => (
            <SelectItem key={patient.$id} value={patient.name}>
              {patient.name}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={createForm.control}
          name="alertType"
          label="Alert Type"
          placeholder="Select an alert type"
        >
          {AlertTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={createForm.control}
          name="severity"
          label="Severity"
          placeholder="Select severity"
        >
          {AlertSeverityOptions.map((severity) => (
            <SelectItem key={severity} value={severity}>
              <span className="capitalize">{severity}</span>
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={createForm.control}
          name="description"
          label="Description"
          placeholder="Describe the alert details..."
        />

        <SubmitButton isLoading={isLoading}>Create Alert</SubmitButton>
      </form>
    </Form>
  );
};
