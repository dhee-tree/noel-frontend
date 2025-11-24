"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginFormFields } from "@/lib/validators/auth";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { InputField } from "@/components/forms/InputField";
import { Form, Container, Alert, Spinner } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import authStyles from "@/components/auth/AuthLayout.module.css";
import styles from "./Login.module.css";

export default function LoginClientPage() {
  const [apiError, setApiError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const sessionExpired = searchParams.get("error") === "session_expired";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormFields) => {
    setApiError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setApiError("Invalid email or password.");
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setApiError("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className={authStyles.page}>
      <div className={authStyles.card}>
        <h1 className={authStyles.title}>Welcome Back</h1>
        <p className={authStyles.subtitle}>
          Log in to manage your Secret Santa
        </p>

        {sessionExpired && (
          <Alert variant="warning" className="mb-4">
            Your session has expired. Please log in again.
          </Alert>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl })}
          className={authStyles.googleButton}
          type="button"
        >
          <FcGoogle size={24} />
          <span>Continue with Google</span>
        </button>

        <div className={authStyles.divider}>or login with email</div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            name="email"
            label="Email Address"
            type="email"
            register={register}
            error={errors.email}
            className="mb-3"
            placeholder="santa@northpole.com"
          />

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label mb-0">Password</label>
              <Link href="/reset-password" className={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>

            <InputField
              name="password"
              label=""
              type="password"
              register={register}
              error={errors.password}
              placeholder="••••••••"
            />
          </div>

          {apiError && (
            <Alert variant="danger" className="mb-4">
              {apiError}
            </Alert>
          )}

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
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </Form>

        <div className={authStyles.footerText}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className={authStyles.link}>
            Sign up for free
          </Link>
        </div>
      </div>
    </Container>
  );
}
