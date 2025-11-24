"use client";
import React, { useEffect, useState } from "react";
import { SearchParam } from "@/lib/search-param";
import { useApiRequest } from "@/hooks";
import { Container, Card, Spinner, Alert, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import EmailPreferencesForm from "@/components/profile/EmailPreferencesForm/EmailPreferencesForm";

export default function EmailPreferencesPage() {
  const token = SearchParam("token");
  const { apiRequest } = useApiRequest();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [prefs, setPrefs] = useState({
    allow_marketing: false,
    allow_newsletter: false,
    allow_product_updates: false,
  });

  useEffect(() => {
    if (!token) {
      setError("Missing preference token.");
      setIsLoading(false);
      return;
    }

    const generic_error_msg =
      "For your security, this magic link has expired. Don't worry—you can still manage your preferences by logging in.";

    const fetchPrefs = async () => {
      try {
        const res = await apiRequest(
          `/api/profile/email-preferences/?token=${token}`,
          { method: "GET" }
        );
        if (!res.ok) setError(generic_error_msg);
        const data = await res.json();
        setPrefs(data);
      } catch (err) {
        console.error("Error fetching email preferences:", err);
        setError(generic_error_msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrefs();
  }, [token, apiRequest]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await apiRequest(
        `/api/profile/email-preferences/?token=${token}`,
        { method: "PATCH", body: prefs }
      );

      if (!res.ok) throw new Error("Failed to update");
      toast.success("Preferences updated!");
    } catch (err) {
      console.error("Error saving email preferences:", err);
      toast.error("Could not save preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error} <br />
          <Button
            href="/profile#email-preferences"
            variant="danger"
            className="fw-bold px-4 py-2 mt-3 text-decoration-none"
          >
            Log In to Manage Preferences
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 font-christmas">Email Preferences</h2>
          <p className="text-muted text-center mb-4">
            Manage what emails you want to receive from Noel.
          </p>

          <EmailPreferencesForm
            prefs={prefs}
            setPrefs={setPrefs}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </Card.Body>
      </Card>
    </Container>
  );
}
