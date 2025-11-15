"use client";
import React from "react";
import { Form } from "react-bootstrap";
import Select, { SingleValue } from "react-select";
import { Controller, Control, FieldError } from "react-hook-form";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: FieldError;
  options: SelectOption[];
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  className?: string;
};

export const SelectField = ({
  name,
  label,
  control,
  error,
  options,
  placeholder = "Select...",
  isSearchable = false,
  isClearable = false,
  className = "",
}: SelectFieldProps) => {
  return (
    <Form.Group controlId={name} className={`position-relative ${className}`}>
      <Form.Label>{label}</Form.Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Select
              {...field}
              options={options}
              value={options.find((option) => option.value === field.value)}
              onChange={(selectedOption: SingleValue<SelectOption>) => {
                field.onChange(selectedOption ? selectedOption.value : "");
              }}
              placeholder={placeholder}
              isSearchable={isSearchable}
              isClearable={isClearable}
              className={error ? "is-invalid" : ""}
            />
            {error && (
              <div className="invalid-feedback d-block">{error.message}</div>
            )}
          </>
        )}
      />
    </Form.Group>
  );
};
