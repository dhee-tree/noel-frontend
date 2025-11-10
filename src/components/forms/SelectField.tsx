"use client";
import React from "react";
import { Form } from "react-bootstrap";
import Select, { StylesConfig, SingleValue } from "react-select";
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
  const customStyles: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: "58px",
      borderColor: error ? "#dc3545" : state.isFocused ? "#86b7fe" : "#dee2e6",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused
        ? error
          ? "0 0 0 0.25rem rgba(220, 53, 69, 0.25)"
          : "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
        : "none",
      "&:hover": {
        borderColor: error ? "#dc3545" : "#86b7fe",
      },
      backgroundColor: "#fff",
      paddingTop: "1.125rem",
      paddingBottom: "0.25rem",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6c757d",
      fontSize: "1rem",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#212529",
      fontSize: "1rem",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      borderRadius: "0.375rem",
      boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.175)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#0d6efd"
        : state.isFocused
        ? "#e7f1ff"
        : "#fff",
      color: state.isSelected ? "#fff" : "#212529",
      "&:active": {
        backgroundColor: "#ffe9e9ff",
      },
    }),
  };

  return (
    <Form.Group controlId={name} className={`position-relative ${className}`}>
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
              styles={customStyles}
              placeholder={placeholder}
              isSearchable={isSearchable}
              isClearable={isClearable}
              className={error ? "is-invalid" : ""}
            />
            <Form.Label
              className="position-absolute"
              style={{
                top: "0.375rem",
                left: "0.75rem",
                fontSize: "0.75rem",
                color: error ? "#dc3545" : "#6c757d",
                pointerEvents: "none",
                transition: "all 0.1s ease-in-out",
                backgroundColor: "#fff",
                padding: "0 0.25rem",
              }}
            >
              {label}
            </Form.Label>
            {error && (
              <div className="invalid-feedback d-block">{error.message}</div>
            )}
          </>
        )}
      />
    </Form.Group>
  );
};
