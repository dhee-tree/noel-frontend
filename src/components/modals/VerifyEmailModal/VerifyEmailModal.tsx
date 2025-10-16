"use client";
import React, { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useApiRequest } from "@/hooks/useApiRequest";
import { mutateCurrentUser } from "@/hooks/useCurrentUser";
import { BaseModal } from "@/components/modals/BaseModal/BaseModal";

interface VerifyEmailModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

export const VerifyEmailModal: React.FC<VerifyEmailModalProps> = ({
  show,
  onHide,
  onSuccess,
}) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { apiRequest, session } = useApiRequest();
  const { update: updateSession } = useSession();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!session?.accessToken) {
        throw new Error("You must be logged in to verify your email.");
      }

      const res = await apiRequest(`/api/auth/verify-email/${code}/`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            errorData.message ||
            "Verification failed. Please check your code."
        );
      }

      setSuccess(true);
      setCode("");

      // Mutate user data globally - all components using useCurrentUser will update
      await mutateCurrentUser();

      // Update the session JWT to reflect the verification status
      await updateSession({
        user: {
          ...session?.user,
          isVerified: true,
        },
        isVerified: true,
      });

      // Call onSuccess callback after short delay
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setError(null);
    setSuccess(false);
    onHide();
  };

  return (
    <BaseModal
      show={show}
      onHide={handleClose}
      title="Verify Your Email"
      footerButtons={[
        {
          label: "Cancel",
          variant: "secondary",
          onClick: handleClose,
          disabled: loading,
        },
        {
          label: "Verify Email",
          variant: "brand",
          type: "submit",
          onClick: handleSubmit,
          disabled: loading || success || !code.trim(),
          loading: loading,
        },
      ]}
    >
      <Form onSubmit={handleSubmit}>
        {success ? (
          <Alert variant="success">
            <strong>Email verified successfully!</strong>
          </Alert>
        ) : (
          <>
            <Form.Group>
              <Form.Label>Enter your verification code</Form.Label>
              <Form.Control
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. ABC123XYZ"
                required
                autoFocus
                disabled={loading}
                maxLength={50}
              />
              <Form.Text className="text-muted">
                Check your email for the verification code we sent you.
              </Form.Text>
            </Form.Group>

            {error && (
              <Alert variant="danger" className="mt-3 mb-0">
                {error}
              </Alert>
            )}
          </>
        )}
      </Form>
    </BaseModal>
  );
};
