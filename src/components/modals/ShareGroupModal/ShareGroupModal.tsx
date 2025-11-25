"use client";
import React from "react";
import { BaseModal } from "../BaseModal/BaseModal";
import {
  FaWhatsapp,
  FaFacebook,
  FaSnapchat,
  FaCopy,
  FaShareAlt,
} from "react-icons/fa";
import { Button, InputGroup, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./ShareGroupModal.module.css";

interface ShareGroupModalProps {
  groupCode: string;
  groupName: string;
  trigger?: {
    type: "button" | "link";
    label?: string;
    icon?: React.ReactNode;
    variant?: string;
    size?: "sm" | "lg";
    className?: string;
  };
}

export const ShareGroupModal = ({
  groupCode,
  groupName,
  trigger,
}: ShareGroupModalProps) => {
  const [inviteLink, setInviteLink] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setInviteLink(`${window.location.origin}/groups?join=${groupCode}`);
    }
  }, [groupCode]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied!");
  };

  const handleShare = (platform: string) => {
    const text = `Join my group "${groupName}" on Noel!`;
    const encodedLink = encodeURIComponent(inviteLink);
    const encodedText = encodeURIComponent(text);

    let url = "";

    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${encodedText}%20${encodedLink}`;
        window.open(url, "_blank");
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        window.open(url, "_blank");
        break;
      case "snapchat":
        handleCopyLink();
        url = `https://www.snapchat.com/share?link=${encodedLink}`;
        setTimeout(() => {
          window.open(url, "_blank");
        }, 500);
        break;
    }
  };

  return (
    <BaseModal
      title="Share Group"
      trigger={
        trigger || {
          type: "button",
          label: "Share",
          icon: <FaShareAlt />,
          variant: "outline-primary",
        }
      }
    >
      <div className={styles.shareGrid}>
        <button
          className={styles.shareButton}
          onClick={() => handleShare("whatsapp")}
        >
          <FaWhatsapp size={24} className={styles.whatsapp} />
          <span>WhatsApp</span>
        </button>
        <button
          className={styles.shareButton}
          onClick={() => handleShare("facebook")}
        >
          <FaFacebook size={24} className={styles.facebook} />
          <span>Facebook</span>
        </button>
        <button
          className={styles.shareButton}
          onClick={() => handleShare("snapchat")}
        >
          <FaSnapchat size={24} className={styles.snapchat} />
          <span>Snapchat</span>
        </button>
      </div>

      <div className={styles.copySection}>
        <label className="form-label small text-muted fw-bold">
          Invite Link
        </label>
        <InputGroup>
          <Form.Control
            readOnly
            value={inviteLink}
            className="bg-white"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <Button variant="outline-secondary" onClick={handleCopyLink}>
            <FaCopy /> Copy
          </Button>
        </InputGroup>
      </div>
    </BaseModal>
  );
};
