"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterUserForm } from "@/lib/validators/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/forms/InputField";
import { SelectField } from "@/components/forms/SelectField";
import { apiRequest } from "@/lib/utils";
import { Form, Container, Alert, Spinner } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import authStyles from "@/components/auth/AuthLayout.module.css";
import styles from "./Register.module.css";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

export default function RegisterClientPage() {
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserForm>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterUserForm) => {
    setApiError("");
    try {
      const res = await apiRequest("/api/register/", {
        method: "POST",
        body: {
          email: data.email,
          password: data.password,
          password2: data.confirmPassword,
          first_name: data.firstName,
          last_name: data.lastName,
          gender: data.gender,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message =
          errorData.password?.[0] ||
          errorData.email?.[0] ||
          errorData.detail ||
          "Registration failed.";
        throw new Error(message);
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResult?.ok) {
        router.push("/dashboard");
      } else {
        throw new Error("Sign-in after registration failed.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("An unexpected error occurred.");
      }
    }
  };

  return (
    <Container className={authStyles.page}>
      <div className={authStyles.card}>
        <h1 className={authStyles.title}>Join the Party</h1>
        <p className={authStyles.subtitle}>Create an account to get started</p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className={authStyles.googleButton}
          type="button"
        >
          <FcGoogle size={24} />
          <span>Sign up with Google</span>
        </button>

        <div className={authStyles.divider}>or sign up with email</div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formRow}>
            <InputField
              name="firstName"
              label="First Name"
              register={register}
              error={errors.firstName}
              placeholder="Santa"
            />
            <InputField
              name="lastName"
              label="Last Name"
              register={register}
              error={errors.lastName}
              placeholder="Claus"
            />
          </div>

          <InputField
            name="email"
            label="Email Address"
            type="email"
            register={register}
            error={errors.email}
            className="mb-3"
            placeholder="santa@northpole.com"
          />

          <SelectField
            name="gender"
            label="Gender"
            control={control}
            options={genderOptions}
            error={errors.gender}
            placeholder="Select your gender"
            className="mb-3"
          />

          <div className={styles.formRow}>
            <InputField
              name="password"
              label="Password"
              type="password"
              register={register}
              error={errors.password}
              placeholder="••••••••"
            />
            <InputField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              register={register}
              error={errors.confirmPassword}
              placeholder="••••••••"
            />
          </div>

          {apiError && (
            <Alert variant="danger" className="mt-2">
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
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </Form>

        <div className={authStyles.footerText}>
          Already have an account?{" "}
          <Link href="/login" className={authStyles.link}>
            Log in here
          </Link>
        </div>
      </div>
    </Container>
  );
}
