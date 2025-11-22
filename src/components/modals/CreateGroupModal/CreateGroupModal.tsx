"use client";
import React, { useState, useRef } from "react";
import { Form, Alert } from "react-bootstrap";
import {
  BaseModal,
  BaseModalRef,
} from "@/components/modals/BaseModal/BaseModal";
import { InputField } from "@/components/forms/InputField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useUserGroups } from "@/hooks/useUserGroups";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { SelectField, SelectOption } from "@/components/forms/SelectField";

interface TriggerConfig {
  type: "button" | "link";
  label?: string;
  icon?: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
  ariaLabel?: string;
}

interface CreateGroupModalProps {
  show?: boolean;
  trigger?: TriggerConfig;
}

const CreateGroupSchema = z.object({
  groupName: z
    .string()
    .min(1, { message: "Group name is required." })
    .max(100, { message: "Group name must be less than 100 characters." }),
  description: z.string().optional(),
  theme: z.string().optional(),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  assignmentRevealDate: z.string().optional(),
  giftExchangeDeadline: z.string().optional(),
  wishlistDeadline: z.string().optional(),
  joinDeadline: z.string().optional(),
  exchangeLocation: z.string().optional(),
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

type CreateGroupForm = z.infer<typeof CreateGroupSchema>;

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  show,
  trigger,
}) => {
  const [apiError, setApiError] = useState("");
  const modalRef = useRef<BaseModalRef>(null);
  const { apiRequest } = useApiRequest();
  const { mutateGroups } = useUserGroups();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateGroupForm>({
    resolver: zodResolver(CreateGroupSchema),
  });

  const onSubmit = async (data: CreateGroupForm) => {
    setApiError("");

    try {
      // Build request body with optional fields
      const requestBody: Record<string, unknown> = {
        group_name: data.groupName.trim(),
      };

      // Add optional fields only if they have values
      if (data.description?.trim()) {
        requestBody.description = data.description.trim();
      }
      if (data.theme) {
        requestBody.theme = data.theme;
      }
      if (data.budgetMin) {
        requestBody.budget_min = parseFloat(data.budgetMin);
      }
      if (data.budgetMax) {
        requestBody.budget_max = parseFloat(data.budgetMax);
      }
      if (data.assignmentRevealDate) {
        requestBody.assignment_reveal_date = data.assignmentRevealDate;
      }
      if (data.giftExchangeDeadline) {
        requestBody.gift_exchange_deadline = data.giftExchangeDeadline;
      }
      if (data.wishlistDeadline) {
        requestBody.wishlist_deadline = data.wishlistDeadline;
      }
      if (data.joinDeadline) {
        requestBody.join_deadline = data.joinDeadline;
      }
      if (data.exchangeLocation?.trim()) {
        requestBody.exchange_location = data.exchangeLocation.trim();
      }
      if (data.isWhiteElephant !== undefined) {
        requestBody.is_white_elephant = data.isWhiteElephant;
      }

      const res = await apiRequest("/api/groups/", {
        method: "POST",
        body: requestBody,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        // Check for field-specific errors first (Django REST Framework pattern)
        const groupNameError = errorData.group_name?.[0];
        const nameError = errorData.name?.[0];
        const detailError = errorData.detail;

        throw new Error(
          groupNameError ||
            nameError ||
            detailError ||
            "Failed to create group. Please try again."
        );
      }

      // Get the created group data
      const createdGroup = await res.json();
      const groupId = createdGroup.group_id;

      // Auto-create wishlist for the new group
      try {
        const wishlistRes = await apiRequest("/api/wishlists/", {
          method: "POST",
          body: { group: groupId },
        });

        if (!wishlistRes.ok) {
          console.error("Failed to create wishlist for new group");
        }
      } catch (wishlistError) {
        console.error("Error creating wishlist:", wishlistError);
      }

      toast.success(`Successfully created "${data.groupName}"!`);
      reset();
      modalRef.current?.close();
      await mutateGroups();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not create group. Please try again.";
      setApiError(message);
    }
  };

  const handleClose = () => {
    reset();
    setApiError("");
    modalRef.current?.close();
  };

  return (
    <BaseModal
      ref={modalRef}
      show={show}
      onHide={handleClose}
      trigger={trigger}
      title="Create a New Group"
      size="lg"
      footerButtons={[
        {
          label: "Cancel",
          variant: "secondary",
          onClick: handleClose,
        },
        {
          label: "Create Group",
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
            placeholder="e.g. Family Secret Santa 2025"
            autoFocus
            disabled={isSubmitting}
            className="mb-3"
          />

          <TextAreaField
            name="description"
            label="Description (Optional)"
            register={register}
            error={errors.description}
            placeholder="Add any rules, themes, or special instructions..."
            disabled={isSubmitting}
            rows={3}
            resize={false}
            helpText="Let members know what to expect"
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
          />
          <Form.Text className="text-muted">
            Where gifts will be exchanged
          </Form.Text>
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
        {/* <div className="mb-4">
          <h6 className="text-muted mb-3">
            Game Mode 🎮
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="white-elephant-tooltip">
                  <strong>White Elephant Mode</strong>
                  <br />
                  One random person will be chosen as &quot;The Snatcher&quot;
                  24 hours before the exchange. They can steal ANY gift! Will it
                  be you? 👀
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
        </div> */}

        {apiError && (
          <Alert variant="danger" className="mt-3">
            {apiError}
          </Alert>
        )}
      </Form>
    </BaseModal>
  );
};
