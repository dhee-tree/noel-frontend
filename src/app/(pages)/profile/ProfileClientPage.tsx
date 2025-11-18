"use client";
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import {
  FaUserCircle,
  FaEdit,
  FaTimes,
  FaCheck,
  FaEnvelope,
  FaCalendar,
  FaShieldAlt,
} from "react-icons/fa";
import { useProfile, useApiRequest } from "@/hooks";
import { InputField, SelectField } from "@/components/forms";
import { ChangePasswordSection } from "@/components/profile/ChangePasswordSection";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import styles from "./ProfileClientPage.module.css";

const updateProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  gender: z.enum(["Male", "Female", "Prefer not to say"]).nullable().optional(),
  address_line1: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
});

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

export default function ProfileClientPage() {
  const { profile, isLoading, error, mutateProfile } = useProfile();
  const { apiRequest } = useApiRequest();
  const { update } = useSession();
  const [isEditMode, setIsEditMode] = useState(false);

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Prefer not to say", label: "Prefer not to say" },
  ];

  // Parse address into components
  const parseAddress = (address?: string | null) => {
    if (!address) return { line1: "", city: "", country: "", postcode: "" };
    const parts = address.split(",").map((p) => p.trim());
    return {
      line1: parts[0] || "",
      city: parts[1] || "",
      country: parts[2] || "",
      postcode: parts[3] || "",
    };
  };

  const addressParts = parseAddress(profile?.address);

  const {
    register: registerProfile,
    control: controlProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile, isSubmitting: isSubmittingProfile },
    reset: resetProfile,
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      gender: profile?.gender || null,
      address_line1: addressParts.line1,
      city: addressParts.city,
      country: addressParts.country,
      postcode: addressParts.postcode,
    },
  });

  const onSubmitProfile = async (data: UpdateProfileForm) => {
    try {
      // Concatenate address parts
      const addressParts = [
        data.address_line1?.trim(),
        data.city?.trim(),
        data.country?.trim(),
        data.postcode?.trim(),
      ].filter(Boolean);

      const address = addressParts.length > 0 ? addressParts.join(", ") : null;

      const payload: Record<string, unknown> = {
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        gender: data.gender || null,
        address: address,
      };

      const response = await apiRequest("/api/profile/", {
        method: "PUT",
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      await mutateProfile();

      // Update the session with new profile data
      await update({
        user: {
          firstName: data.first_name.trim(),
          lastName: data.last_name.trim(),
        },
      });

      setIsEditMode(false);
    } catch (error) {
      console.error("Update profile error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    }
  };

  const handleCancelEdit = () => {
    resetProfile();
    setIsEditMode(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Failed to load profile. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Profile Header */}
          <Card className="mb-4 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 gap-3">
                <div className="d-flex align-items-start w-100">
                  <div className={styles.avatarWrapper}>
                    <FaUserCircle size={64} className="text-primary" />
                  </div>
                  <div className="ms-3 flex-grow-1 overflow-hidden">
                    <h3 className="mb-1">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <div className="d-flex align-items-center text-truncate">
                        <FaEnvelope
                          size={14}
                          className="text-muted flex-shrink-0"
                        />
                        <span className="text-muted ms-2 text-truncate">
                          {profile.email}
                        </span>
                      </div>
                      {profile.is_verified && (
                        <Badge
                          bg="primary"
                          className={`${styles.verifiedBadge} flex-shrink-0`}
                        >
                          <FaShieldAlt size={12} className="me-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {!isEditMode && (
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => setIsEditMode(true)}
                    className="flex-shrink-0"
                  >
                    <FaEdit className="me-1" />
                    <span className="d-none d-sm-inline">Edit Profile</span>
                    <span className="d-inline d-sm-none">Edit</span>
                  </Button>
                )}
              </div>

              {/* Joined Date */}
              <div className="d-flex align-items-center text-muted mb-3">
                <FaCalendar className="me-2" />
                <small>Joined on {formatDate(profile.date_created)}</small>
              </div>

              {isEditMode ? (
                /* Edit Mode */
                <Form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                  <Row>
                    <Col md={6}>
                      <InputField
                        name="first_name"
                        label="First Name"
                        type="text"
                        register={registerProfile}
                        error={errorsProfile.first_name}
                        disabled={isSubmittingProfile}
                        className="mb-3"
                        isRequired
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        name="last_name"
                        label="Last Name"
                        type="text"
                        register={registerProfile}
                        error={errorsProfile.last_name}
                        disabled={isSubmittingProfile}
                        className="mb-3"
                        isRequired
                      />
                    </Col>
                  </Row>

                  <SelectField
                    name="gender"
                    label="Gender"
                    control={controlProfile}
                    options={genderOptions}
                    error={errorsProfile.gender}
                    placeholder="Select gender..."
                    isSearchable={false}
                    isClearable={true}
                    className="mb-3"
                  />

                  <h6 className="mt-4 mb-3">Address (Optional)</h6>
                  <InputField
                    name="address_line1"
                    label="Address Line 1"
                    type="text"
                    register={registerProfile}
                    error={errorsProfile.address_line1}
                    disabled={isSubmittingProfile}
                    className="mb-3"
                  />

                  <Row>
                    <Col md={6}>
                      <InputField
                        name="city"
                        label="City"
                        type="text"
                        register={registerProfile}
                        error={errorsProfile.city}
                        disabled={isSubmittingProfile}
                        className="mb-3"
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        name="postcode"
                        label="Post Code"
                        type="text"
                        register={registerProfile}
                        error={errorsProfile.postcode}
                        disabled={isSubmittingProfile}
                        className="mb-3"
                      />
                    </Col>
                  </Row>

                  <InputField
                    name="country"
                    label="Country"
                    type="text"
                    register={registerProfile}
                    error={errorsProfile.country}
                    disabled={isSubmittingProfile}
                    className="mb-4"
                  />

                  <div className="d-flex gap-2">
                    <Button
                      type="submit"
                      variant="success"
                      disabled={isSubmittingProfile}
                    >
                      {isSubmittingProfile ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaCheck className="me-1" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCancelEdit}
                      disabled={isSubmittingProfile}
                    >
                      <FaTimes className="me-1" />
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                /* Display Mode */
                <div>
                  <Row className="mb-3">
                    <Col md={6}>
                      <div className={styles.infoItem}>
                        <span className="text-muted">First Name</span>
                        <p className="mb-0 fw-medium">{profile.first_name}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className={styles.infoItem}>
                        <span className="text-muted">Last Name</span>
                        <p className="mb-0 fw-medium">{profile.last_name}</p>
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <div className={styles.infoItem}>
                        <span className="text-muted">Gender</span>
                        <p className="mb-0 fw-medium">
                          {profile.gender || "Not specified"}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  {profile.address && (
                    <div className={styles.infoItem}>
                      <span className="text-muted">Address</span>
                      <p className="mb-0 fw-medium">{profile.address}</p>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>

          <ChangePasswordSection />
        </Col>
      </Row>
    </Container>
  );
}
