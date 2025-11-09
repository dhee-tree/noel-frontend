"use client";

import React, { useRef } from "react";
import { Alert } from "react-bootstrap";
import {
  BaseModal,
  BaseModalRef,
} from "@/components/modals/BaseModal/BaseModal";

interface TriggerConfig {
  type: "button" | "link";
  label?: string;
  icon?: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
  ariaLabel?: string;
}

interface ConfirmModalProps {
  show?: boolean;
  onHide?: () => void;

  // Trigger configuration for self-contained mode
  trigger?: TriggerConfig;

  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "success" | "primary";
  isLoading?: boolean;
  alertMessage?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onHide,
  trigger,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
  alertMessage,
}) => {
  const modalRef = useRef<BaseModalRef>(null);

  const handleConfirm = () => {
    onConfirm();
    // Close modal after confirmation
    if (onHide) {
      onHide();
    } else {
      modalRef.current?.close();
    }
  };

  const handleClose = () => {
    if (onHide) {
      onHide();
    } else {
      modalRef.current?.close();
    }
  };

  return (
    <BaseModal
      ref={modalRef}
      show={show}
      onHide={handleClose}
      trigger={trigger}
      title={title}
      size="lg"
      centered
      footerButtons={[
        {
          label: cancelLabel,
          variant: "secondary",
          onClick: handleClose,
          disabled: isLoading,
        },
        {
          label: confirmLabel,
          variant: variant,
          onClick: handleConfirm,
          disabled: isLoading,
          loading: isLoading,
        },
      ]}
    >
      <p>{message}</p>
      {alertMessage && (
        <Alert variant={variant} className="mt-3 mb-0">
          <strong>Warning:</strong> {alertMessage}
        </Alert>
      )}
    </BaseModal>
  );
};
