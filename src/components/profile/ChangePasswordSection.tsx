"use client";
import React, { useState } from "react";
import {
  Card,
  Button,
  Collapse,
  Form,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { FaLock, FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useApiRequest } from "@/hooks";
import { InputField } from "@/components/forms";

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export const ChangePasswordSection: React.FC = () => {
  const { apiRequest } = useApiRequest();
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      const response = await apiRequest("/api/auth/change-password/", {
        method: "POST",
        body: {
          current_password: data.current_password,
          new_password: data.new_password,
          confirm_password: data.confirm_password,
        },
      });

      if (!response.ok) {
        await response.json();
        if (response.status === 409) {
          toast.error(
            "You are using your old password. Please choose a new password."
          );
          return;
        }

        toast.error("Failed to change password");
        return;
      }

      toast.success("Password changed successfully!");
      reset();
      setShowPasswordSection(false);
    } catch (error) {
      console.error("Change password error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to change password";
      toast.error(message);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body className="p-4">
        <Button
          variant="link"
          className="text-decoration-none p-0 d-flex align-items-center justify-content-between w-100"
          onClick={() => setShowPasswordSection(!showPasswordSection)}
        >
          <div className="d-flex align-items-center">
            <FaLock className="me-2 text-secondary" />
            <h5 className="mb-0">Change Password</h5>
          </div>
          <span className="text-secondary">
            {showPasswordSection ? "▲" : "▼"}
          </span>
        </Button>

        <Collapse in={showPasswordSection}>
          <div className="mt-4">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <InputField
                name="current_password"
                label="Current Password"
                type="password"
                register={register}
                error={errors.current_password}
                disabled={isSubmitting}
                className="mb-3"
                isRequired
              />

              <Form.Group className="mb-3">
                <Form.Label>
                  New Password <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showNewPassword ? "text" : "password"}
                    {...register("new_password")}
                    isInvalid={!!errors.new_password}
                    disabled={isSubmitting}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isSubmitting}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                  {errors.new_password && (
                    <Form.Control.Feedback type="invalid">
                      {errors.new_password.message}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>
                  Confirm New Password <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirm_password")}
                    isInvalid={!!errors.confirm_password}
                    disabled={isSubmitting}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                  {errors.confirm_password && (
                    <Form.Control.Feedback type="invalid">
                      {errors.confirm_password.message}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
              </Form.Group>

              <Button type="submit" variant="success" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <FaCheck className="me-1" />
                    Change Password
                  </>
                )}
              </Button>
            </Form>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};
