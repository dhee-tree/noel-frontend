"use client";
import React, { useState, useRef } from "react";
import { Form, Alert } from "react-bootstrap";
import {
  BaseModal,
  BaseModalRef,
} from "@/components/modals/BaseModal/BaseModal";
import { InputField } from "@/components/forms/InputField";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useUserGroups } from "@/hooks/useUserGroups";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

interface TriggerConfig {
  type: "button" | "link";
  label?: string;
  icon?: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
  ariaLabel?: string;
}

interface CreateGroupModalProps {
  show?: boolean;
  onHide?: () => void;

  // Trigger configuration for self-contained mode
  trigger?: TriggerConfig;

  onSuccess?: () => void;
}

const CreateGroupSchema = z.object({
  groupName: z
    .string()
    .min(1, { message: "Group name is required." })
    .max(100, { message: "Group name must be less than 100 characters." }),
});

type CreateGroupForm = z.infer<typeof CreateGroupSchema>;

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  show,
  onHide,
  trigger,
  onSuccess,
}) => {
  const [apiError, setApiError] = useState("");
  const modalRef = useRef<BaseModalRef>(null);
  const { apiRequest } = useApiRequest();
  const { mutateGroups } = useUserGroups();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateGroupForm>({
    resolver: zodResolver(CreateGroupSchema),
  });

  const onSubmit = async (data: CreateGroupForm) => {
    setApiError("");

    try {
      const res = await apiRequest("/api/groups/", {
        method: "POST",
        body: { group_name: data.groupName.trim() },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        
        // Check for field-specific errors first (Django REST Framework pattern)
        const groupNameError = errorData.group_name?.[0];
        const nameError = errorData.name?.[0];
        const detailError = errorData.detail;
        
        throw new Error(
          groupNameError || 
          nameError || 
          detailError || 
          "Failed to create group. Please try again."
        );
      }

      const responseData = await res.json();
      toast.success(`Successfully created "${data.groupName}"!`);
      reset();
      modalRef.current?.close();
      await mutateGroups();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not create group. Please try again.";
      setApiError(message);
    }
  };

  const handleClose = () => {
    reset();
    setApiError("");
    if (onHide) onHide();
  };

  return (
    <BaseModal
      ref={modalRef}
      show={show}
      onHide={handleClose}
      trigger={trigger}
      title="Create a New Group"
      footerButtons={[
        {
          label: "Cancel",
          variant: "secondary",
          onClick: handleClose,
        },
        {
          label: "Create Group",
          variant: "brand",
          type: "submit",
          onClick: () => handleSubmit(onSubmit)(),
          disabled: isSubmitting,
          loading: isSubmitting,
        },
      ]}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="groupName"
          label="Group Name"
          type="text"
          register={register}
          error={errors.groupName}
          placeholder="e.g. Family Secret Santa 2025"
          autoFocus
          disabled={isSubmitting}
          maxLength={100}
        />
        <Form.Text className="text-muted d-block mb-3">
          Give your Secret Santa group a memorable name.
        </Form.Text>

        {apiError && (
          <Alert variant="danger" className="mt-2">
            {apiError}
          </Alert>
        )}
      </Form>
    </BaseModal>
  );
};
