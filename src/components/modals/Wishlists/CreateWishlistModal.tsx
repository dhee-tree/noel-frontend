"use client";
import React, { useState, useMemo, useRef } from "react";
import { Form, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiRequest, useUserWishlists } from "@/hooks";
import {
  createWishlistSchema,
  CreateWishlistInput,
} from "@/lib/validators/wishlist";
import { Group } from "@/hooks/useUserGroups";
import { SelectField } from "@/components/forms";
import {
  BaseModal,
  BaseModalRef,
} from "@/components/modals/BaseModal/BaseModal";
import { toast } from "react-toastify";

interface TriggerConfig {
  type: "button";
  label?: string;
  icon?: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
}

interface CreateWishlistModalProps {
  trigger?: TriggerConfig;
  groups: Group[];
}

export const CreateWishlistModal: React.FC<CreateWishlistModalProps> = ({
  trigger,
  groups,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalRef = useRef<BaseModalRef>(null);
  const { mutateWishlists } = useUserWishlists();
  const { apiRequest } = useApiRequest();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateWishlistInput>({
    resolver: zodResolver(createWishlistSchema),
  });

  const selectedGroupId = watch("group");

  const groupOptions = useMemo(
    () =>
      groups.map((group) => ({
        value: group.group_id,
        label: group.group_name,
      })),
    [groups]
  );

  const handleClose = () => {
    setErrorMessage(null);
    modalRef.current?.close();
  };

  const onSubmit = async (data: CreateWishlistInput) => {
    setErrorMessage(null);

    try {
      const response = await apiRequest("/api/wishlists/", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        await response.json();
        if (response.status === 409) {
          toast.error(
            "This group already has a wishlist. Please choose another group."
          );
          return;
        }
      }

      toast.success("Wishlist created successfully!");
      await mutateWishlists();
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
      title="Create New Wishlist"
      footerButtons={[
        {
          label: "Cancel",
          variant: "secondary",
          onClick: handleClose,
        },
        {
          label: "Create Wishlist",
          variant: "success",
          type: "submit",
          onClick: () => handleSubmit(onSubmit)(),
          disabled: isSubmitting || groups.length === 0,
          loading: isSubmitting,
        },
      ]}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && (
          <Alert variant="danger" className="mb-3">
            {errorMessage}
          </Alert>
        )}

        {groups.length === 0 ? (
          <Alert variant="warning">
            You need to join or create a group before creating a wishlist.
          </Alert>
        ) : (
          <>
            <SelectField
              name="group"
              label="Select Group *"
              control={control}
              options={groupOptions}
              error={errors.group}
              placeholder="Choose a group..."
              isSearchable={true}
              isClearable={false}
              className="mb-2"
            />
            <Form.Text className="text-muted d-block mb-3">
              Wishlist will be named &quot;
              {groups.find((g) => g.group_id === selectedGroupId)?.group_name ||
                "Group Name"}{" "}
              Wishlist&quot;
            </Form.Text>
          </>
        )}
      </Form>
    </BaseModal>
  );
};
