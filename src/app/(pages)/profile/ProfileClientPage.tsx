"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import {
  FaUser,
  FaEdit,
  FaTimes,
  FaCheck,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaVenusMars,
  FaLock,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import { useProfile, useApiRequest } from "@/hooks";
import { InputField, SelectField } from "@/components/forms";
import {
  ChangePasswordSection,
  EmailPreferencesForm,
} from "@/components/profile";
import { Prefs } from "@/components/profile/EmailPreferencesForm/EmailPreferencesForm";
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
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  const [emailPrefs, setEmailPrefs] = useState<Prefs>({
    allow_marketing: false,
    allow_newsletter: false,
    allow_product_updates: false,
  });

  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const apiRequestRef = React.useRef(apiRequest);
  useEffect(() => {
    apiRequestRef.current = apiRequest;
  }, [apiRequest]);

  useEffect(() => {
    if (!profile || prefsLoaded) return;

    let cancelled = false;
    const fetchPrefs = async () => {
      try {
        const res = await apiRequestRef.current(
          "/api/profile/email-preferences/",
          {
            method: "GET",
          }
        );
        if (!cancelled && res.ok) {
          const data = await res.json();
          setEmailPrefs(data);
        }
      } catch (err) {
        if (!cancelled) console.error("Failed to load preferences", err);
      } finally {
        if (!cancelled) setPrefsLoaded(true);
      }
    };

    fetchPrefs();
    return () => {
      cancelled = true;
    };
  }, [profile, prefsLoaded]);

  const handleSavePrefs = async () => {
    setIsSavingPrefs(true);
    try {
      const res = await apiRequest("/api/profile/email-preferences/", {
        method: "PATCH",
        body: emailPrefs,
      });

      if (!res.ok) throw new Error("Failed to update");
      toast.success("Email preferences updated!");
    } catch (err) {
      console.error(err);
      toast.error("Could not save preferences.");
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Prefer not to say", label: "Prefer not to say" },
  ];

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
      await update({
        user: {
          firstName: data.first_name.trim(),
          lastName: data.last_name.trim(),
        },
      });

      setIsEditMode(false);
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
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
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading profile...</p>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Failed to load profile.</Alert>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      <div className={styles.profileGrid}>
        <div className={styles.identityCard}>
          <div className={styles.avatarWrapper}>
            <FaUser className={styles.avatarIcon} />
          </div>
          <h2 className={styles.userName}>
            {profile.first_name} {profile.last_name}
          </h2>
          <div className={styles.userEmail}>{profile.email}</div>

          <div className={styles.badges}>
            {profile.is_verified && (
              <span className={styles.verifiedBadge}>
                <FaShieldAlt /> Verified
              </span>
            )}
          </div>

          {!isEditMode && (
            <Button
              variant="dark"
              className="w-100"
              onClick={() => setIsEditMode(true)}
            >
              <FaEdit className="me-2" /> Edit Profile
            </Button>
          )}

          <div className={styles.joinDate}>
            <FaCalendarAlt className="me-2" />
            Member since {formatDate(profile.date_created)}
          </div>
        </div>

        <div>
          {/* 1. Personal Details Card */}
          <div className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.sectionTitle}>Personal Information</h3>
              {isEditMode && (
                <Button
                  variant="link"
                  className="text-muted p-0 text-decoration-none"
                  onClick={handleCancelEdit}
                >
                  <FaTimes className="me-1" /> Cancel
                </Button>
              )}
            </div>

            {isEditMode ? (
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
                  className="mb-3"
                />

                <div className={styles.formSectionTitle}>
                  <FaMapMarkerAlt /> Shipping Address
                </div>

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

                <div className={styles.buttonGroup}>
                  <Button
                    type="submit"
                    variant="success"
                    disabled={isSubmittingProfile}
                    className="px-4 fw-bold"
                  >
                    {isSubmittingProfile ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      <>
                        <FaCheck className="me-2" /> Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={handleCancelEdit}
                    disabled={isSubmittingProfile}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            ) : (
              <div className={styles.infoGrid}>
                <div className={styles.infoBlock}>
                  <span className={styles.label}>First Name</span>
                  <span className={styles.value}>{profile.first_name}</span>
                </div>
                <div className={styles.infoBlock}>
                  <span className={styles.label}>Last Name</span>
                  <span className={styles.value}>{profile.last_name}</span>
                </div>
                <div className={styles.infoBlock}>
                  <span className={styles.label}>Gender</span>
                  <span className={styles.value}>
                    {profile.gender ? (
                      <>
                        <FaVenusMars className="me-2 text-muted" />
                        {profile.gender}
                      </>
                    ) : (
                      <span className={styles.emptyValue}>Not specified</span>
                    )}
                  </span>
                </div>
                <div className={styles.infoBlock}>
                  <span className={styles.label}>Address</span>
                  <span className={styles.value}>
                    {profile.address ? (
                      <>
                        <FaMapMarkerAlt className="me-2 text-muted" />
                        {profile.address}
                      </>
                    ) : (
                      <span className={styles.emptyValue}>
                        No address set (Used for shipping gifts)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.securityWrapper}>
            <div className={styles.sectionHeaderBar}>
              {" "}
              <h5 className={styles.sectionHeaderTitle}>
                <FaLock className="text-secondary" /> Security
              </h5>
            </div>
            <div className="p-4">
              <ChangePasswordSection />
            </div>
          </div>

          <div className={styles.preferencesWrapper} id="email-preferences">
            <div className={styles.sectionHeaderBar}>
              <h5 className={styles.sectionHeaderTitle}>
                <FaEnvelopeOpenText className="text-secondary" /> Email
                Preferences
              </h5>
            </div>
            <div className={styles.sectionContent}>
              <EmailPreferencesForm
                prefs={emailPrefs}
                setPrefs={setEmailPrefs}
                onSave={handleSavePrefs}
                isSaving={isSavingPrefs}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
