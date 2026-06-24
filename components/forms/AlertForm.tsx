"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAlert, useCreateAlert, useUpdateAlert } from "@/hooks/useAlerts";
import {
  AlertFormValidation,
  AlertStatusEditValidation,
} from "@/lib/validation";
import { Alert, Patient } from "@/types/appwrite.types";

const EditAlertForm = ({ alert }: { alert: Alert }) => {
  const updateAlertMutation = useUpdateAlert();

  const editForm = useForm<z.infer<typeof AlertStatusEditValidation>>({
    resolver: zodResolver(AlertStatusEditValidation),
    defaultValues: {
      status: alert.status,
    },
  });

  const onEditSubmit = (values: z.infer<typeof AlertStatusEditValidation>) => {
    updateAlertMutation.mutate({ alertId: alert.$id, status: values.status });
  };

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

          <SubmitButton isLoading={updateAlertMutation.isPending}>
            Update Alert
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};

const CreateAlertForm = ({ patients }: { patients: Patient[] }) => {
  const createAlertMutation = useCreateAlert();

  const createForm = useForm<z.infer<typeof AlertFormValidation>>({
    resolver: zodResolver(AlertFormValidation),
    defaultValues: {
      patientName: "",
      alertType: "",
      severity: "medium",
      description: "",
    },
  });

  const onCreateSubmit = (values: z.infer<typeof AlertFormValidation>) => {
    createAlertMutation.mutate(values);
  };

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

        <SubmitButton isLoading={createAlertMutation.isPending}>
          Create Alert
        </SubmitButton>
      </form>
    </Form>
  );
};

export const AlertForm = ({
  patients = [],
  alertId,
}: {
  patients?: Patient[];
  alertId?: string;
}) => {
  const isEdit = !!alertId;
  const { data: alert, isPending: isAlertLoading } = useAlert(alertId ?? "");

  if (isEdit) {
    if (isAlertLoading) {
      return <p className="text-dark-700">Loading alert...</p>;
    }

    if (!alert) {
      return <p className="text-red-400">Alert not found.</p>;
    }

    return <EditAlertForm alert={alert} />;
  }

  return <CreateAlertForm patients={patients} />;
};
