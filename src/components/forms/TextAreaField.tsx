"use client";
import React from "react";
import { Form } from "react-bootstrap";
import { UseFormRegister, FieldError } from "react-hook-form";

type TextAreaFieldProps = {
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
  rows?: number;
  helpText?: string;
  maxLength?: number;
  resize?: boolean; // Allow resize or not
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "rows">;

export const TextAreaField = ({
  name,
  label,
  register,
  error,
  placeholder,
  rows = 3,
  helpText,
  maxLength = 100,
  resize = false,
  className,
  ...props
}: TextAreaFieldProps) => {
  // Filter out props that might conflict with Form.Control
  const filteredProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => 
      !["size", "value", "defaultValue"].includes(key)
    )
  );

  return (
    <Form.Group controlId={name} className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="textarea"
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
        isInvalid={!!error}
        style={{ resize: resize ? "vertical" : "none" }}
        maxLength={maxLength}
        {...filteredProps}
      />
      {helpText && !error && (
        <Form.Text className="text-muted">{helpText}</Form.Text>
      )}
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};
