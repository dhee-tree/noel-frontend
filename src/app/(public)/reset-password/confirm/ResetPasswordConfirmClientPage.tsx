"use client";
import React, { useEffect, useState } from "react";
import { Container, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordConfirmSchema,
  type ResetPasswordConfirmForm,
} from "@/lib/validators/auth";
import { InputField } from "@/components/forms/InputField";
import { useApiRequest } from "@/hooks/useApiRequest";
import Link from "next/link";
import { SearchParam } from "@/lib/search-param";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import authStyles from "@/components/auth/AuthLayout.module.css";

export default function ResetPasswordConfirmClientPage() {
  const uid = SearchParam("uid") || "";
  const token = SearchParam("token") || "";
  const { apiRequest } = useApiRequest();
  const [status, setStatus] = useState<
    "idle" | "validating" | "valid" | "invalid"
  >("idle");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const validateLink = async () => {
      setStatus("validating");
      try {
        const resp = await apiRequest(
          `/api/auth/reset-password/validate/?uid=${encodeURIComponent(
            uid
          )}&token=${encodeURIComponent(token)}`,
          {
            method: "GET",
          }
        );

        if (resp.ok) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch (err) {
        console.error("Link validation error:", err);
        setStatus("invalid");
      }
    };

    validateLink();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordConfirmForm>({
    resolver: zodResolver(ResetPasswordConfirmSchema),
    defaultValues: { new_password: "", confirm_password: "" },
  });

  const onSubmit = async (data: ResetPasswordConfirmForm) => {
    try {
      const res = await apiRequest("/api/auth/reset-password/confirm/", {
        method: "POST",
        body: {
          uid,
          token,
          new_password: data.new_password,
          confirm_password: data.confirm_password,
        },
      });

      if (res.ok) {
        toast.success("Password reset successfully!");
        setIsSubmitted(true);
      } else {
        const json = await res.json().catch(() => null);
        const msg =
          json?.detail || json?.message || "Failed to reset password.";
        toast.error(msg);
      }
    } catch (err) {
      console.error("Reset confirm error:", err);
      toast.error("Network error while resetting password.");
    }
  };

  return (
    <Container className={authStyles.page}>
      <div className={authStyles.card}>
        <h1 className={authStyles.title}>New Password</h1>

        {status === "validating" && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
            <p className="text-muted mt-3">Verifying secure link...</p>
          </div>
        )}

        {status === "invalid" && (
          <div className={authStyles.errorMessage}>
            <FaExclamationCircle size={48} className="mb-3 text-danger" />
            <h4 className="h5 fw-bold mb-2">Link Expired or Invalid</h4>
            <p className="text-muted mb-4 text-start">
              This password reset link is no longer valid. Please request a new
              one.
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <Link
                href="/reset-password"
                className={authStyles.submitButton}
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                  width: "auto",
                  padding: "0.8rem 1.5rem",
                }}
              >
                Request New Link
              </Link>
            </div>
            <div className="mt-3">
              <Link href="/login" className={authStyles.linkButton}>
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {status === "valid" && !isSubmitted && (
          <>
            <p className={authStyles.subtitle}>
              Please choose a new password for your account.
            </p>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="text-start"
            >
              <InputField
                name="new_password"
                label="New Password"
                type="password" // Triggers Eye Icon
                register={register}
                error={errors.new_password}
                disabled={isSubmitting}
                className="mb-3"
                placeholder="At least 8 characters"
              />

              <InputField
                name="confirm_password"
                label="Confirm Password"
                type="password" // Triggers Eye Icon
                register={register}
                error={errors.confirm_password}
                disabled={isSubmitting}
                className="mb-4"
                placeholder="Re-enter password"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className={authStyles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Updating...
                  </>
                ) : (
                  "Set New Password"
                )}
              </button>

              <div className="text-center mt-3">
                <Link href="/login" className={authStyles.linkButton}>
                  Cancel
                </Link>
              </div>
            </Form>
          </>
        )}

        {isSubmitted && (
          <div className={authStyles.successMessage}>
            <FaCheckCircle className={authStyles.successIcon} />
            <h3 className="h4 fw-bold text-dark mb-2">Password Updated!</h3>
            <p className="text-muted mb-4">
              Your password has been changed successfully. You can now log in
              with your new credentials.
            </p>
            <Link
              href="/login"
              className={authStyles.submitButton}
              style={{ textDecoration: "none", display: "inline-block" }}
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
