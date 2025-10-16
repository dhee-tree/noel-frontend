"use client";
import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import styles from "./BaseModal.module.css";

interface BaseModalButton {
  label: string;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "brand"; // Custom brand variant using accent green
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

interface BaseModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "lg" | "xl";
  centered?: boolean;
  closeButton?: boolean;
  footerButtons?: BaseModalButton[];
  backdrop?: "static" | true | false;
  keyboard?: boolean;
  className?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  show,
  onHide,
  title,
  children,
  size,
  centered = true,
  closeButton = true,
  footerButtons,
  backdrop = true,
  keyboard = true,
  className,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered={centered}
      size={size}
      backdrop={backdrop}
      keyboard={keyboard}
      className={className}
    >
      <Modal.Header closeButton={closeButton} className={styles.header}>
        <Modal.Title className={styles.title}>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.body}>{children}</Modal.Body>

      {footerButtons && footerButtons.length > 0 && (
        <Modal.Footer className={styles.footer}>
          {footerButtons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant === "brand" ? undefined : button.variant || "primary"}
              className={button.variant === "brand" ? styles.brandButton : undefined}
              onClick={button.onClick}
              disabled={button.disabled || button.loading}
              type={button.type || "button"}
            >
              {button.loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {button.label}
                </>
              ) : (
                button.label
              )}
            </Button>
          ))}
        </Modal.Footer>
      )}
    </Modal>
  );
};
