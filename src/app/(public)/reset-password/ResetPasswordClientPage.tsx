"use client";
import React, { useState } from "react";
import { Container, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, ResetPasswordForm } from "@/lib/validators/auth";
import { InputField } from "@/components/forms/InputField";
import { useApiRequest } from "@/hooks/useApiRequest";
import { FaArrowLeft, FaEnvelopeOpenText } from "react-icons/fa";
import Link from "next/link";
import authStyles from "@/components/auth/AuthLayout.module.css";
import styles from "./ResetPassword.module.css";

export default function ResetPasswordClientPage() {
  const { apiRequest } = useApiRequest();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      const response = await apiRequest("/api/auth/reset-password/", {
        method: "POST",
        body: { email: data.email.trim() },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to send reset email.");
      }

      toast.success("Link sent!");
      reset();
      setIsSubmitted(true);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send reset email."
      );
    }
  };

  return (
    <Container className={authStyles.page}>
      <div className={authStyles.card}>
        {!isSubmitted ? (
          <>
            <h1 className={authStyles.title}>Reset Password</h1>
            <p className={authStyles.subtitle}>
              Forgot your password? Enter your email below and we&apos;ll send
              you instructions to reset it.
            </p>

            <Form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="text-start"
            >
              <InputField
                name="email"
                label="Email Address"
                type="email"
                placeholder="santa@northpole.com"
                register={register}
                error={errors.email}
                disabled={isSubmitting}
                className="mb-4"
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
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </Form>

            <Link href="/login" className={styles.backButton}>
              <FaArrowLeft className="me-2" /> Back to Login
            </Link>
          </>
        ) : (
          <div>
            <div className={styles.successIconWrapper}>
              <FaEnvelopeOpenText />
            </div>

            <h2 className={authStyles.title}>Check Your Inbox</h2>

            <p className={styles.successText}>
              We&apos;ve sent a password reset link to your email. Please check
              your spam folder if you don&apos;t see it.
            </p>

            <Link
              href="/login"
              className={authStyles.submitButton}
              style={{ textDecoration: "none", display: "block" }}
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
