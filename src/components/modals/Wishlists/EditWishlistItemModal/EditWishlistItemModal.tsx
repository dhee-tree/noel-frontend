"use client";
import React, { useState, useRef, useEffect } from "react";
import { Form, Alert, InputGroup, Spinner } from "react-bootstrap";
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
import styles from "./EditWishlistItemModal.module.css";
import z from "zod";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { swrFetcher } from "@/lib/swr-fetcher";
import { WishlistItem } from "@/types/wishlist";

interface TriggerConfig {
  type: "button";
  label?: string;
  icon?: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
}

interface EditWishlistItemModalProps {
  trigger?: TriggerConfig;
  wishlistId: string;
  itemId: string;
}

export const EditWishlistItemModal: React.FC<EditWishlistItemModalProps> = ({
  trigger,
  wishlistId,
  itemId,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fetchData, setFetchData] = useState<boolean>(false);
  const modalRef = useRef<BaseModalRef>(null);
  const { apiRequest } = useApiRequest();
  const { mutateItems } = useWishlistItems(wishlistId);

  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const endpoint = fetchData
    ? `${apiUrl}/api/wishlists/${wishlistId}/items/${itemId}/`
    : null;

  const {
    data: itemData,
    error,
    isLoading,
    mutate,
  } = useSWR<WishlistItem>(
    endpoint,
    (url: string) =>
      swrFetcher<WishlistItem>(url, session?.accessToken as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      shouldRetryOnError: false,
    }
  );

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
      name: itemData?.name || "",
      description: itemData?.description || "",
      link: itemData?.link || "",
      store: itemData?.store || "",
      price_estimate: itemData?.price_estimate || null,
      priority: itemData?.priority ?? null,
      is_public: itemData?.is_public ?? true,
      is_purchased: itemData?.is_purchased ?? false,
    },
  });

  const isPublic = watch("is_public");
  const isPurchased = watch("is_purchased");

  // Reset form when item changes
  useEffect(() => {
    reset({
      name: itemData?.name || "",
      description: itemData?.description || "",
      link: itemData?.link || "",
      store: itemData?.store || "",
      price_estimate: itemData?.price_estimate || null,
      priority: itemData?.priority ?? null,
      is_public: itemData?.is_public ?? true,
      is_purchased: itemData?.is_purchased ?? false,
    });
  }, [itemData, reset]);

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
        is_purchased: data.is_purchased,
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

      const response = await apiRequest(
        `/api/wishlists/${wishlistId}/items/${itemId}/`,
        {
          method: "PUT",
          body: requestBody,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update wishlist item");
      }

      toast.success("Wishlist item updated successfully!");
      await mutateItems();
      mutate();
      reset();
      modalRef.current?.close();
    } catch (error) {
      console.error("Edit wishlist item error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to edit wishlist item";
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
      onEntering={() => setFetchData(true)}
      footerButtons={[
        {
          label: "Cancel",
          variant: "secondary",
          onClick: handleClose,
        },
        {
          label: "Save Changes",
          variant: "success",
          type: "submit",
          onClick: () => handleSubmit(onSubmit)(),
        },
      ]}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && (
          <Alert variant="danger" className="mb-3">
            {errorMessage}
          </Alert>
        )}

        {error ? (
          <Alert variant="danger" className="mb-3">
            Failed to load wishlist item data. Please try again later.
          </Alert>
        ) : isLoading || !itemData ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Fetching wishlist item details...</p>
          </div>
        ) : (
          <>
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
              maxLength={500}
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
                    <strong>Note:</strong> Private items are only visible to
                    you. Your Secret Santa won&apos;t be able to see them when
                    viewing your wishlist.
                  </small>
                </Alert>
              )}
            </Form.Group>

            {/* Toggle is purchased */}
            <Form.Group className="mb-3">
              <div className="d-flex align-items-center justify-content-between p-3 border rounded">
                <div className="d-flex align-items-center">
                  <div>
                    <Form.Label className="mb-0 fw-bold">
                      Mark as Purchased
                    </Form.Label>
                    <Form.Text className="d-block text-muted">
                      {isPurchased
                        ? "This item has been marked as purchased"
                        : "This item has not been purchased yet"}
                    </Form.Text>
                  </div>
                </div>
                <Controller
                  name="is_purchased"
                  control={control}
                  render={({ field }) => (
                    <Form.Check
                      type="switch"
                      id="is-purchased-switch"
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      className={styles.switch}
                    />
                  )}
                />
              </div>
            </Form.Group>
          </>
        )}
      </Form>
    </BaseModal>
  );
};
