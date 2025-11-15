"use client";
import React from "react";
import { Form } from "react-bootstrap";
import { UseFormRegister, FieldError } from "react-hook-form";

type InputFieldProps = {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "datetime-local"
    | "time"
    | "tel"
    | "url";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
  isRequired?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputField = ({
  name,
  label,
  type = "text",
  register,
  error,
  placeholder,
  isRequired = false,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <Form.Group controlId={name} className={className}>
      <Form.Label>
        {label}
        {isRequired && <span className="text-danger"> *</span>}
      </Form.Label>
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
    </Form.Group>
  );
};
