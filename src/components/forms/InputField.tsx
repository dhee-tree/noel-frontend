"use client";
import React from "react";
import { Form, FloatingLabel } from "react-bootstrap";
import { UseFormRegister, FieldError } from "react-hook-form";

type InputFieldProps = {
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputField = ({
  name,
  label,
  type = "text",
  register,
  error,
  placeholder = " ",
  ...props
}: InputFieldProps) => {
  return (
    <Form.Group controlId={name}>
      <FloatingLabel label={label}>
        <Form.Control
          type={type}
          placeholder={placeholder}
          {...register(name)}
          isInvalid={!!error}
          {...Object.fromEntries(
            Object.entries(props).filter(([key]) => key !== "size")
          )}
        />
        <Form.Control.Feedback type="invalid">
          {error?.message}
        </Form.Control.Feedback>
      </FloatingLabel>
    </Form.Group>
  );
};
