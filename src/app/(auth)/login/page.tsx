"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginFormFields } from "@/lib/validators/auth";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { InputField } from "@/components/forms/InputField";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import styles from "../register/Register.module.css";

export default function LoginPage() {
  const [apiError, setApiError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

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
        setApiError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error("Login submission failed:", err);
      setApiError("An unexpected error occurred.");
    }
  };

  return (
    <Container className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back!</h1>
        <Button
          variant="success"
          onClick={() => signIn("google", { callbackUrl })}
          className="w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <FcGoogle size={24} />
          Continue with Google
        </Button>
        <div className={styles.divider}>OR</div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            name="email"
            label="Email"
            type="email"
            register={register}
            error={errors.email}
            className="mb-3"
          />
          <InputField
            name="password"
            label="Password"
            type="password"
            register={register}
            error={errors.password}
            className="mb-3"
          />

          {apiError && <Alert variant="danger">{apiError}</Alert>}

          <Button
            variant="danger"
            type="submit"
            disabled={isSubmitting}
            className="w-100 mt-2"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </Form>
      </div>
    </Container>
  );
}
