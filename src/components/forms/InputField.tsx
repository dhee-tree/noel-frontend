"use client";
import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { UseFormRegister, FieldError } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  maxLength?: number;
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
  maxLength = 50,
  ...props
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";

  const renderType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <Form.Group controlId={name} className={className}>
      {label && (
        <Form.Label>
          {label} {isRequired && <span className="text-danger">*</span>}
        </Form.Label>
      )}

      <InputGroup hasValidation>
        <Form.Control
          type={renderType}
          placeholder={placeholder}
          {...register(name)}
          isInvalid={!!error}
          maxLength={maxLength}
          style={
            isPasswordField ? { borderRight: "none", zIndex: 0 } : undefined
          }
          {...Object.fromEntries(
            Object.entries(props).filter(([key]) => key !== "size")
          )}
        />

        {isPasswordField && (
          <InputGroup.Text
            onClick={() => setShowPassword(!showPassword)}
            style={{
              cursor: "pointer",
              backgroundColor: "#fff",
              borderLeft: "none",
              borderColor: error ? "#dc3545" : "#dee2e6",
            }}
          >
            {showPassword ? (
              <FaEyeSlash className="text-muted" />
            ) : (
              <FaEye className="text-muted" />
            )}
          </InputGroup.Text>
        )}

        <Form.Control.Feedback type="invalid">
          {error?.message}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
};
