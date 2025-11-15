"use client";
import React, { useState, useRef } from "react";
import { Form, Alert, InputGroup } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useApiRequest, useWishlistItems } from "@/hooks";
import { wishlistItemSchema } from "@/lib/validators/wishlist";
import { InputField, TextAreaField, SelectField } from "@/components/forms";
import {
  BaseModal,
  BaseModalRef,
} from "@/components/modals/BaseModal/BaseModal";
import { toast } from "react-toastify";
import styles from "./AddWishlistItemModal.module.css";
import z from "zod";

interface TriggerConfig {
  type: "button";
  label?: string;
  icon?: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
}

interface AddWishlistItemModalProps {
  trigger?: TriggerConfig;
  wishlistId: string;
}

export const AddWishlistItemModal: React.FC<AddWishlistItemModalProps> = ({
  trigger,
  wishlistId,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalRef = useRef<BaseModalRef>(null);
  const { apiRequest } = useApiRequest();
  const { mutateItems } = useWishlistItems(wishlistId);

  type CreateWishlistItemForm = z.infer<typeof wishlistItemSchema>;

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    reset,
    register,
  } = useForm({
    resolver: zodResolver(wishlistItemSchema),
    defaultValues: {
      is_public: true,
    },
  });

  const isPublic = watch("is_public");

  const priorityOptions = [
    { value: "", label: "No Priority" },
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
  ];

  const handleClose = () => {
    setErrorMessage(null);
    modalRef.current?.close();
  };

  const onSubmit = async (data: CreateWishlistItemForm) => {
    setErrorMessage(null);

    try {
      const requestBody: Record<string, unknown> = {
        name: data.name.trim(),
        is_public: data.is_public,
      };

      if (data.description?.trim()) {
        requestBody.description = data.description.trim();
      }
      if (data.link?.trim()) {
        requestBody.link = data.link.trim();
      }
      if (data.store?.trim()) {
        requestBody.store = data.store.trim();
      }
      if (data.price_estimate !== null && data.price_estimate !== undefined) {
        requestBody.price_estimate = data.price_estimate;
      }
      if (data.priority) {
        requestBody.priority = data.priority;
      }

      const response = await apiRequest(`/api/wishlists/${wishlistId}/items/`, {
        method: "POST",
        body: requestBody,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to add wishlist item");
      }

      toast.success("Wishlist item added successfully!");
      await mutateItems();
      reset();
      modalRef.current?.close();
    } catch (error) {
      console.error("Create wishlist error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to create wishlist";
      setErrorMessage(message);
    }
  };

  return (
    <BaseModal
      ref={modalRef}
      onHide={handleClose}
      trigger={trigger}
      title="Add Wishlist Item"
      size="lg"
      footerButtons={[
        {
          label: "Cancel",
          variant: "secondary",
          onClick: handleClose,
        },
        {
          label: "Add Item",
          variant: "success",
          type: "submit",
          onClick: () => handleSubmit(onSubmit)(),
          loading: isSubmitting,
          disabled: isSubmitting,
        },
      ]}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && (
          <Alert variant="danger" className="mb-3">
            {errorMessage}
          </Alert>
        )}

        {/* Item Name */}
        <InputField
          name="name"
          label="Item Name"
          type="text"
          register={register}
          error={errors.name}
          placeholder="e.g., Wireless Headphones, Board Game, etc."
          disabled={isSubmitting}
          className="mb-3"
          isRequired={true}
        />

        {/* Description */}
        <TextAreaField
          name="description"
          label="Description (Optional)"
          register={register}
          error={errors.description}
          placeholder="Add any details like color, size, model, etc."
          rows={3}
          disabled={isSubmitting}
          className="mb-3"
        />

        <SelectField
          name="priority"
          label="Priority (Optional)"
          control={control}
          options={priorityOptions}
          error={errors.priority}
          placeholder="Select priority..."
          isSearchable={false}
          isClearable={true}
          className="mb-3"
        />

        <Form.Group className="mb-3">
          <Form.Label>Price Estimate (Optional)</Form.Label>
          <InputGroup>
            <InputGroup.Text>£</InputGroup.Text>
            <Form.Control
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price_estimate", {
                setValueAs: (v) => (v === "" ? null : parseFloat(v)),
              })}
              isInvalid={!!errors.price_estimate}
              disabled={isSubmitting}
              required={false}
            />
          </InputGroup>
          {errors.price_estimate && (
            <Form.Control.Feedback type="invalid" className="d-block">
              {errors.price_estimate.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Store */}
        <InputField
          name="store"
          label="Store Name (Optional)"
          type="text"
          register={register}
          error={errors.store}
          placeholder="e.g., Amazon, Target, Best Buy, etc."
          disabled={isSubmitting}
          className="mb-3"
        />

        {/* Link */}
        <InputField
          name="link"
          label="Product Link (Optional)"
          type="url"
          register={register}
          error={errors.link}
          placeholder="https://example.com/product"
          disabled={isSubmitting}
          className="mb-3"
        />
        <Form.Text className="text-muted d-block mb-3">
          Add a link to help your Secret Santa find the exact item.
        </Form.Text>

        {/* Public/Private Toggle */}
        <Form.Group className="mb-3">
          <div className="d-flex align-items-center justify-content-between p-3 border rounded">
            <div className="d-flex align-items-center">
              {isPublic ? (
                <FaEye className="me-2 text-success" size={20} />
              ) : (
                <FaEyeSlash className="me-2 text-secondary" size={20} />
              )}
              <div>
                <Form.Label className="mb-0 fw-bold">
                  {isPublic ? "Public Item" : "Private Item"}
                </Form.Label>
                <Form.Text className="d-block text-muted">
                  {isPublic
                    ? "Your matched Secret Santa will see this item"
                    : "This item is hidden from everyone, including your Secret Santa"}
                </Form.Text>
              </div>
            </div>
            <Controller
              name="is_public"
              control={control}
              render={({ field }) => (
                <Form.Check
                  type="switch"
                  id="is-public-switch"
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  className={styles.switch}
                />
              )}
            />
          </div>
          {!isPublic && (
            <Alert variant="warning" className="mt-2 mb-0">
              <small>
                <strong>Note:</strong> Private items are only visible to you.
                Your Secret Santa won&apos;t be able to see them when viewing
                your wishlist.
              </small>
            </Alert>
          )}
        </Form.Group>
      </Form>
    </BaseModal>
  );
};
