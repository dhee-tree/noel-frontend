"use client";
import React, { useEffect, useState, useRef } from "react";
import { BaseModal, BaseModalRef } from "../BaseModal/BaseModal";
import { useApiRequest } from "@/hooks/useApiRequest";
import { Spinner, Button } from "react-bootstrap";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./AutoJoinModal.module.css";

interface AutoJoinModalProps {
  onSuccess?: () => void;
}

export const AutoJoinModal = ({ onSuccess }: AutoJoinModalProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const joinCode = searchParams?.get("join");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [joinedGroup, setJoinedGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const modalRef = useRef<BaseModalRef>(null);
  const { apiRequest } = useApiRequest();
  const hasAttemptedRef = useRef(false);

  const handleAutoJoin = React.useCallback(
    async (code: string) => {
      hasAttemptedRef.current = true;
      setStatus("loading");

      try {
        const res = await apiRequest("/api/groups/join/", {
          method: "POST",
          body: { group_code: code },
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));

          if (payload.detail?.includes("already a member")) {
            throw new Error("You are already a member of this group.");
          }

          throw new Error(
            payload.group_code?.[0] || payload.detail || "Could not join group."
          );
        }

        const data = await res.json();
        setJoinedGroup({
          id: data.group.group_id,
          name: data.group.group_name,
        });
        setStatus("success");
        if (onSuccess) onSuccess();
      } catch (err: unknown) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to join group"
        );
      }
    },
    [apiRequest, onSuccess]
  );

  useEffect(() => {
    if (joinCode && !hasAttemptedRef.current) {
      handleAutoJoin(joinCode);
    }
  }, [joinCode, handleAutoJoin]);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("join");
    router.replace(`/groups?${params.toString()}`);

    setStatus("idle");
    hasAttemptedRef.current = false;
  };

  const handleGoToGroup = () => {
    if (joinedGroup) {
      router.push(`/groups/${joinedGroup.id}`);
    } else {
      handleClose();
    }
  };

  if (!joinCode) return null;

  return (
    <BaseModal
      ref={modalRef}
      show={!!joinCode}
      onHide={handleClose}
      title="Joining Group"
      centered
      backdrop="static"
      keyboard={status !== "loading"}
      closeButton={status !== "loading"}
    >
      <div className={styles.statusContainer}>
        {status === "loading" && (
          <>
            <Spinner animation="border" variant="primary" className="mb-3" />
            <p className={styles.message}>
              Joining group with code{" "}
              <span className={styles.codeBadge}>{joinCode}</span>...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className={`${styles.iconWrapper} ${styles.successIcon}`}>
              <FaCheckCircle />
            </div>
            <h4 className="mb-2">Success!</h4>
            <p className={styles.message}>
              You have successfully joined <strong>{joinedGroup?.name}</strong>
            </p>
            <div className="d-flex gap-2 mt-3">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="success" onClick={handleGoToGroup}>
                Go to Group
              </Button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className={`${styles.iconWrapper} ${styles.errorIcon}`}>
              <FaExclamationCircle />
            </div>
            <h4 className="mb-2">Oops!</h4>
            <p className={styles.message}>{errorMessage}</p>
            <Button variant="secondary" onClick={handleClose} className="mt-3">
              Close
            </Button>
          </>
        )}
      </div>
    </BaseModal>
  );
};
