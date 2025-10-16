"use client";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { BaseModal } from "@/components/modals/BaseModal/BaseModal";
import type { Session } from "next-auth";

interface JoinGroupModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: (message: string) => void;
  session?: Session & { accessToken?: string };
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  show,
  onHide,
  onSuccess,
  session,
}) => {
  const [groupCode, setGroupCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL;
      if (apiBase) {
        const token = session?.accessToken ?? null;
        const res = await fetch(`${apiBase}/api/groups/join/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ code: groupCode }),
        });
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.detail || "Join group failed");
        }
        onSuccess?.(`Successfully requested to join "${groupCode}"`);
      } else {
        // Simulate success if no API configured
        await new Promise((r) => setTimeout(r, 700));
        onSuccess?.(`Request sent to join group "${groupCode}"`);
      }

      setGroupCode("");
      onHide();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not join group. Try again.";
      onSuccess?.(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setGroupCode("");
    onHide();
  };

  return (
    <BaseModal
      show={show}
      onHide={handleClose}
      title="Join a Group"
      footerButtons={[
        {
          label: "Cancel",
          variant: "secondary",
          onClick: handleClose,
        },
        {
          label: "Request to Join",
          variant: "brand",
          type: "submit",
          onClick: handleSubmit,
          disabled: loading || !groupCode.trim(),
          loading: loading,
        },
      ]}
    >
      <Form onSubmit={handleSubmit}>
        <Form.Label>Enter the group code you received</Form.Label>
        <Form.Control
          type="text"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
          placeholder="e.g. ABC123"
          required
          autoFocus
          disabled={loading}
          maxLength={20}
        />
        <Form.Text className="text-muted">
          Ask the group admin for the code.
        </Form.Text>
      </Form>
    </BaseModal>
  );
};
