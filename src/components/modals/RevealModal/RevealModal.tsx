"use client";
import React, { useRef, useState, useEffect } from "react";
import { Spinner, Alert } from "react-bootstrap";
import {
  BaseModal,
  BaseModalRef,
} from "@/components/modals/BaseModal/BaseModal";
import { useApiRequest, useGroupPick } from "@/hooks";
import { toast } from "react-toastify";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { FaBell, FaMapMarkerAlt } from "react-icons/fa";
import { GroupPick } from "@/hooks/useGroupPick";
import { PingUserModal } from "@/components/modals";
import styles from "./RevealModal.module.css";
import Image from "next/image";

interface TriggerConfig {
  type: "button";
  label?: string;
  icon?: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
}

interface RevealModalProps {
  trigger?: TriggerConfig;
  groupId: string;
  pick: GroupPick | null;
  leftToPick: number;
}

export const RevealModal: React.FC<RevealModalProps> = ({
  trigger,
  groupId,
  leftToPick,
  pick: result,
}) => {
  const modalRef = useRef<BaseModalRef>(null);
  const { apiRequest } = useApiRequest();
  const { mutatePick } = useGroupPick(groupId, false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleClose = () => {
    setErrorMessage(null);
    setIsSubmitting(false);
    modalRef.current?.close();
  };

  const handlePick = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const endpoint = `/api/groups/${groupId}/pick/`;
      const response = await apiRequest(endpoint, {
        method: "POST",
      });

      if (response.status !== 201) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create pick");
      }
      setShowConfetti(true);
      await mutatePick();
      toast.info("🎉 Your match has been revealed!");
      timerRef.current = window.setTimeout(() => setShowConfetti(false), 5000);
    } catch (err) {
      console.error("Reveal pick error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to reveal pick"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <BaseModal
      ref={modalRef}
      trigger={trigger}
      title={result ? "Match Revealed" : "Reveal Your Match"}
      size="lg"
      footerButtons={
        result
          ? [
              {
                label: "Close",
                variant: "secondary",
                onClick: handleClose,
              },
            ]
          : [
              {
                label: "Cancel",
                variant: "secondary",
                onClick: handleClose,
              },
            ]
      }
    >
      <div className="p-2">
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.2}
            style={{ zIndex: 2000 }}
          />
        )}

        {errorMessage && (
          <Alert variant="danger" className="mb-3">
            {errorMessage}
          </Alert>
        )}

        {result ? (
          <div className={styles.resultCard}>
            <div className={styles.introLabel}>You have been matched with</div>

            <div className={styles.revealedName}>{result.picked_name}</div>

            <div className={styles.addressBox}>
              <div className={styles.addressLabel}>
                <FaMapMarkerAlt /> Shipping Address
              </div>
              <div className={styles.addressText}>
                {result.picked_address || "No address provided yet."}
              </div>
            </div>

            {(!result.picked_address ||
              result.picked_address.trim() === "") && (
              <div className="mt-4">
                <PingUserModal
                  trigger={{
                    type: "button",
                    label: "Ping to Add Address",
                    variant: "outline-success",
                    size: "sm",
                    icon: <FaBell />,
                  }}
                  pickID={result.pick_id}
                  pingType="address"
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <p className={styles.instructionText}>
              Select a mystery box to reveal your Secret Santa match!
            </p>

            {leftToPick === 0 ? (
              <Alert variant="warning">No available boxes to choose.</Alert>
            ) : (
              <div className={styles.grid}>
                {Array.from({ length: Math.max(0, leftToPick) }).map(
                  (_, idx) => (
                    <button
                      key={idx}
                      className={styles.mysteryBox}
                      onClick={() => !isSubmitting && handlePick()}
                      disabled={isSubmitting}
                      aria-label={`Reveal box ${idx + 1}`}
                      type="button"
                    >
                      {isSubmitting ? (
                        <Spinner animation="border" variant="primary" />
                      ) : (
                        <Image
                          src="/images/svg/gift.svg"
                          alt="gift box"
                          className={styles.giftIcon}
                          aria-hidden="true"
                          /* Increased resolution, CSS handles visual size */
                          width={140}
                          height={140}
                        />
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </BaseModal>
  );
};

export default RevealModal;