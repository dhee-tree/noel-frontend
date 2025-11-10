"use client";

import React, { useEffect, useRef } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  BaseModal,
  BaseModalRef,
} from "@/components/modals/BaseModal/BaseModal";
import { InputField } from "@/components/forms/InputField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { SelectField, SelectOption } from "@/components/forms/SelectField";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { FaQuestionCircle } from "react-icons/fa";
import { Group } from "@/hooks/useUserGroups";

const EditGroupSchema = z.object({
  groupName: z.string().min(3, "Group name must be at least 3 characters"),
  description: z.string().optional(),
  theme: z.string().optional(),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  exchangeLocation: z.string().optional(),
  joinDeadline: z.string().optional(),
  wishlistDeadline: z.string().optional(),
  assignmentRevealDate: z.string().optional(),
  giftExchangeDeadline: z.string().optional(),
  isWhiteElephant: z.boolean().optional(),
});

const THEME_OPTIONS: SelectOption[] = [
  { value: "christmas", label: "🎄 Christmas" },
  { value: "winter", label: "❄️ Winter Holiday" },
  { value: "office", label: "💼 Office Party" },
  { value: "family", label: "👨‍👩‍👧‍👦 Family" },
  { value: "friends", label: "👥 Friends" },
  { value: "general", label: "🎁 General" },
];

interface TriggerConfig {
  type: "button" | "link";
  label?: string;
  icon?: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
  ariaLabel?: string;
}

type EditGroupFormData = z.infer<typeof EditGroupSchema>;

interface EditGroupModalProps {
  show?: boolean;
  onHide?: () => void;
  trigger?: TriggerConfig;
  onSuccess?: () => void;
  group: Group;
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({
  show,
  onHide,
  trigger,
  onSuccess,
  group,
}) => {
  const { data: session } = useSession();
  const modalRef = useRef<BaseModalRef>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditGroupFormData>({
    resolver: zodResolver(EditGroupSchema),
  });

  // Populate form with existing group data
  useEffect(() => {
    if (group) {
      reset({
        groupName: group.group_name,
        description: group.description || "",
        theme: group.theme || "",
        budgetMin: group.budget_min?.toString() || "",
        budgetMax: group.budget_max?.toString() || "",
        exchangeLocation: group.exchange_location || "",
        joinDeadline: group.join_deadline
          ? new Date(group.join_deadline).toISOString().split("T")[0]
          : "",
        wishlistDeadline: group.wishlist_deadline
          ? new Date(group.wishlist_deadline).toISOString().split("T")[0]
          : "",
        assignmentRevealDate: group.assignment_reveal_date
          ? new Date(group.assignment_reveal_date).toISOString().split("T")[0]
          : "",
        giftExchangeDeadline: group.gift_exchange_deadline
          ? new Date(group.gift_exchange_deadline).toISOString().split("T")[0]
          : "",
        isWhiteElephant: group.is_white_elephant || false,
      });
    }
  }, [group, reset]);

  const onSubmit = async (data: EditGroupFormData) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("API URL not configured");

      // Build request body with snake_case for backend
      const requestBody: Record<string, unknown> = {
        group_name: data.groupName.trim(),
      };

      // Add optional fields only if they have values
      if (data.description?.trim())
        requestBody.description = data.description.trim();
      if (data.theme) requestBody.theme = data.theme;
      if (data.budgetMin) requestBody.budget_min = parseFloat(data.budgetMin);
      if (data.budgetMax) requestBody.budget_max = parseFloat(data.budgetMax);
      if (data.exchangeLocation?.trim())
        requestBody.exchange_location = data.exchangeLocation.trim();
      if (data.joinDeadline) requestBody.join_deadline = data.joinDeadline;
      if (data.wishlistDeadline)
        requestBody.wishlist_deadline = data.wishlistDeadline;
      if (data.assignmentRevealDate)
        requestBody.assignment_reveal_date = data.assignmentRevealDate;
      if (data.giftExchangeDeadline)
        requestBody.gift_exchange_deadline = data.giftExchangeDeadline;
      if (data.isWhiteElephant !== undefined)
        requestBody.is_white_elephant = data.isWhiteElephant;

      const response = await fetch(`${apiUrl}/api/groups/${group.group_id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 423) {
          toast.error("This group is archived and cannot be edited.");
          modalRef.current?.close();
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update group");
      }

      modalRef.current?.close();
      onSuccess?.();
      toast.success("Group updated successfully!");
    } catch (error) {
      console.error("Edit group error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update group"
      );
    }
  };

  const handleClose = () => {
    modalRef.current?.close();
    onHide?.();
  };

  return (
    <BaseModal
      ref={modalRef}
      show={show}
      onHide={handleClose}
      trigger={trigger}
      title="Edit Group"
      size="lg"
      footerButtons={[
        {
          label: "Cancel",
          variant: "secondary",
          onClick: handleClose,
        },
        {
          label: isSubmitting ? "Updating..." : "Update Group",
          variant: "brand",
          type: "submit",
          onClick: () => handleSubmit(onSubmit)(),
          disabled: isSubmitting,
          loading: isSubmitting,
        },
      ]}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Information */}
        <div className="mb-4">
          <h6 className="text-muted mb-3">Basic Information</h6>
          <InputField
            name="groupName"
            label="Group Name"
            type="text"
            register={register}
            error={errors.groupName}
            placeholder="e.g., Office Secret Santa 2024"
            disabled={isSubmitting}
            maxLength={100}
          />

          <TextAreaField
            name="description"
            label="Description (Optional)"
            register={register}
            error={errors.description}
            placeholder="Tell members what this group is about..."
            helpText="Add details about your Secret Santa event"
            rows={3}
            resize={false}
            disabled={isSubmitting}
            maxLength={500}
            className="mb-3"
          />

          <Controller
            name="theme"
            control={control}
            render={() => (
              <SelectField
                name="theme"
                label="Theme (Optional)"
                control={control}
                error={errors.theme}
                options={THEME_OPTIONS}
                placeholder="Select a theme..."
                isSearchable={false}
                isClearable={true}
                className="mb-3"
              />
            )}
          />
        </div>

        {/* Budget Settings */}
        <div className="mb-4">
          <h6 className="text-muted mb-3">Budget (Optional)</h6>
          <div className="row">
            <div className="col-md-6">
              <InputField
                name="budgetMin"
                label="Minimum (£)"
                type="number"
                register={register}
                error={errors.budgetMin}
                placeholder="e.g. 20"
                disabled={isSubmitting}
                step="0.01"
                min="0"
              />
            </div>
            <div className="col-md-6">
              <InputField
                name="budgetMax"
                label="Maximum (£)"
                type="number"
                register={register}
                error={errors.budgetMax}
                placeholder="e.g. 50"
                disabled={isSubmitting}
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Exchange Details */}
        <div className="mb-4">
          <h6 className="text-muted mb-3">Exchange Details (Optional)</h6>
          <InputField
            name="exchangeLocation"
            label="Exchange Location"
            type="text"
            register={register}
            error={errors.exchangeLocation}
            placeholder="e.g. Office Conference Room or Virtual/Mail"
            disabled={isSubmitting}
            maxLength={200}
          />
          <Form.Text className="text-muted d-block">
            Where gifts will be exchanged
          </Form.Text>
        </div>

        {/* Important Dates */}
        <div className="mb-4">
          <h6 className="text-muted mb-3">Important Dates (Optional)</h6>
          <div className="row">
            <div className="col-md-6">
              <InputField
                name="joinDeadline"
                label="Join Deadline"
                type="date"
                register={register}
                error={errors.joinDeadline}
                disabled={isSubmitting}
              />
              <Form.Text className="text-muted d-block mb-3">
                Last day to join the group
              </Form.Text>
            </div>
            <div className="col-md-6">
              <InputField
                name="wishlistDeadline"
                label="Wishlist Deadline"
                type="date"
                register={register}
                error={errors.wishlistDeadline}
                disabled={isSubmitting}
              />
              <Form.Text className="text-muted d-block mb-3">
                Last day to submit wishlists
              </Form.Text>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <InputField
                name="assignmentRevealDate"
                label="Assignment Reveal Date"
                type="date"
                register={register}
                error={errors.assignmentRevealDate}
                disabled={isSubmitting}
              />
              <Form.Text className="text-muted d-block mb-3">
                When Secret Santa assignments are revealed
              </Form.Text>
            </div>
            <div className="col-md-6">
              <InputField
                name="giftExchangeDeadline"
                label="Gift Exchange Date"
                type="date"
                register={register}
                error={errors.giftExchangeDeadline}
                disabled={isSubmitting}
              />
              <Form.Text className="text-muted d-block mb-3">
                When gifts should be exchanged
              </Form.Text>
            </div>
          </div>
        </div>

        {/* White Elephant Mode */}
        <div className="mb-4">
          <h6 className="text-muted mb-3">
            Game Mode �
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="white-elephant-tooltip">
                  <strong>White Elephant Mode</strong>
                  <br />
                  One random person will be chosen as &quot;The Snatcher&quot;
                  24 hours before the exchange. They can steal ANY gift!
                  <br />
                  <br />
                  <em>Traditional mode is classic Secret Santa.</em>
                </Tooltip>
              }
            >
              <FaQuestionCircle
                className="ms-2"
                style={{ cursor: "pointer", fontSize: "0.9rem" }}
              />
            </OverlayTrigger>
          </h6>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="isWhiteElephant"
              label={
                <span>
                  Enable White Elephant Mode 🎲{" "}
                  <small className="text-muted">
                    (adds gift-stealing excitement!)
                  </small>
                </span>
              }
              {...register("isWhiteElephant")}
              disabled={isSubmitting}
            />
            <Form.Text className="text-muted">
              When enabled, one person will randomly get the power to snatch
              someone else&apos;s gift
            </Form.Text>
          </Form.Group>
        </div>
      </Form>
    </BaseModal>
  );
};
