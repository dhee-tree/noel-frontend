"use client";
import React, { useState, useRef } from "react";
import { Form } from "react-bootstrap";
import {
  BaseModal,
  BaseModalRef,
} from "@/components/modals/BaseModal/BaseModal";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useUserGroups } from "@/hooks/useUserGroups";
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

interface JoinGroupModalProps {
  show?: boolean;
  onHide?: () => void;

  // Trigger configuration for self-contained mode
  trigger?: TriggerConfig;

  onSuccess?: () => void;
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  show,
  onHide,
  trigger,
  onSuccess,
}) => {
  const [groupCode, setGroupCode] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<BaseModalRef>(null);
  const { apiRequest } = useApiRequest();
  const { mutateGroups } = useUserGroups();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    try {
      const res = await apiRequest("/api/groups/join/", {
        method: "POST",
        body: { group_code: groupCode },
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));

        // Check for field-specific errors first (Django REST Framework pattern)
        const groupCodeError = payload.group_code?.[0];
        const detailError = payload.detail;

        throw new Error(
          groupCodeError ||
            detailError ||
            "Could not join group. Please try again."
        );
      }

      toast.success(`Successfully joined the group!`);
      setGroupCode("");
      modalRef.current?.close();
      await mutateGroups();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Could not join group. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setGroupCode("");
    if (onHide) onHide();
  };

  return (
    <BaseModal
      ref={modalRef}
      show={show}
      onHide={handleClose}
      trigger={trigger}
      title="Join a Group"
      footerButtons={[
        {
          label: "Cancel",
          variant: "secondary",
          onClick: handleClose,
        },
        {
          label: "Request to Join",
          variant: "brand",
          type: "submit",
          onClick: handleSubmit,
          disabled: loading || !groupCode.trim(),
          loading: loading,
        },
      ]}
    >
      <Form onSubmit={handleSubmit}>
        <Form.Label>Enter the group code you received</Form.Label>
        <Form.Control
          type="text"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
          placeholder="e.g. ABC123"
          required
          autoFocus
          disabled={loading}
          maxLength={20}
        />
        <Form.Text className="text-muted">
          Ask the group admin for the code.
        </Form.Text>
      </Form>
    </BaseModal>
  );
};
