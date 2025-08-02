"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterUserForm } from "@/lib/validators/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/forms/InputField";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import styles from "./Register.module.css";

export default function RegisterPage() {
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserForm>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterUserForm) => {
    setApiError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            password2: data.confirmPassword,
            first_name: data.firstName,
            last_name: data.lastName,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        const message =
          errorData.password?.[0] ||
          errorData.email?.[0] ||
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
    } catch (err: any) {
      setApiError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <Container className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Your Account</h1>
        <Button
          variant="success"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <FcGoogle size={24} />
          Sign Up with Google
        </Button>
        <div className={styles.divider}>OR</div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col sm={6}>
              <InputField
                name="firstName"
                label="First Name"
                register={register}
                error={errors.firstName}
              />
            </Col>
            <Col sm={6}>
              <InputField
                name="lastName"
                label="Last Name"
                register={register}
                error={errors.lastName}
              />
            </Col>
          </Row>

          <InputField
            name="email"
            label="Email"
            type="email"
            register={register}
            error={errors.email}
          />
          <InputField
            name="password"
            label="Password"
            type="password"
            register={register}
            error={errors.password}
          />
          <InputField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            register={register}
            error={errors.confirmPassword}
          />

          {apiError && (
            <Alert variant="danger" className="mt-3">
              {apiError}
            </Alert>
          )}

          <Button
            variant="danger"
            type="submit"
            disabled={isSubmitting}
            className="w-100 mt-3"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </Form>
      </div>
    </Container>
  );
}
