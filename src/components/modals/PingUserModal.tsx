"use client";
import React, { useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import {
  BaseModal,
  BaseModalRef,
} from "@/components/modals/BaseModal/BaseModal";
import { useApiRequest } from "@/hooks";
import { toast } from "react-toastify";
import { ApiRequestOptions } from "@/hooks/useApiRequest";

interface TriggerConfig {
  type: "button";
  label?: string;
  icon?: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
}

interface PingUserModalProps {
  trigger?: TriggerConfig;
  pickID: string;
  pingType: string;
  modalSize?: "sm" | "lg";
}

export const PingUserModal: React.FC<PingUserModalProps> = ({
  trigger,
  pickID,
  pingType,
  modalSize = "sm",
}) => {
  const modalRef = useRef<BaseModalRef>(null);
  const { apiRequest } = useApiRequest();
  const [isPingSubmitting, setIsPingSubmitting] = useState(false);
  const [pingError, setPingError] = useState<string | null>(null);

  const handleSendPing = async () => {
    if (!pickID) {
      setPingError("No pick available to ping.");
      return;
    }

    setPingError(null);
    setIsPingSubmitting(true);

    try {
      const endpoint = `/api/wishlists/pick/${pickID}/ping/`;
      const options: ApiRequestOptions = { method: "POST" };
      if (pingType === "address") {
        options.body = { type: pingType };
      }
      const response = await apiRequest(endpoint, options);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to send ping");
      }

      toast.success(
        "Ping sent — the recipient will be notified (they won't know who pinged)."
      );
      modalRef.current?.close();
    } catch (err) {
      console.error("Ping error:", err);
      setPingError(err instanceof Error ? err.message : "Failed to send ping");
    } finally {
      setIsPingSubmitting(false);
    }
  };

  const friendlyType = pingType || "wishlist";

  return (
    <BaseModal
      ref={modalRef}
      trigger={trigger}
      title={`Ping to add ${friendlyType}`}
      size={modalSize}
      centered
      footerButtons={[
        {
          label: "Cancel",
          variant: "secondary",
          onClick: () => modalRef.current?.close(),
          disabled: isPingSubmitting,
        },
        {
          label: "Send Ping",
          variant: "success",
          onClick: handleSendPing,
          disabled: isPingSubmitting,
          loading: isPingSubmitting,
        },
      ]}
    >
      <p>
        Send a polite ping to remind this person to add their {friendlyType}.
        They will not see who pinged them.
      </p>
      {pingError && <Alert variant="danger">{pingError}</Alert>}
    </BaseModal>
  );
};

export default PingUserModal;
