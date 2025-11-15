"use client";
import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import styles from "./BaseModal.module.css";

export interface BaseModalRef {
  close: () => void;
}

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
    | "brand" // Custom brand variant using accent green
    | "brandOutline"; // Outlined brand variant
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

interface TriggerConfig {
  type: "button" | "link";
  label?: string;
  icon?: React.ReactNode;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
  ariaLabel?: string;
}

interface BaseModalProps {
  show?: boolean;
  onHide?: () => void;
  trigger?: TriggerConfig;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "lg" | "xl";
  centered?: boolean;
  closeButton?: boolean;
  footerButtons?: BaseModalButton[];
  backdrop?: "static" | true | false;
  keyboard?: boolean;
  className?: string;

  // Lifecycle hooks
  onEntering?: () => void;
  onExiting?: () => void;
}

export const BaseModal = forwardRef<BaseModalRef, BaseModalProps>(
  (
    {
      show: externalShow,
      onHide: externalOnHide,
      trigger,
      title,
      children,
      size,
      centered = true,
      closeButton = true,
      footerButtons,
      backdrop = true,
      keyboard = true,
      className,
      onEntering,
      onExiting,
    },
    ref
  ) => {
    // Internal state for self-contained mode
    const [internalShow, setInternalShow] = useState(false);

    // Use external control if provided, otherwise use internal
    const isControlled = externalShow !== undefined;
    const show = isControlled ? externalShow : internalShow;

    const handleHide = () => {
      if (isControlled && externalOnHide) {
        externalOnHide();
      } else {
        setInternalShow(false);
      }
    };

    const handleShow = () => {
      setInternalShow(true);
    };

    // Expose close method via ref
    useImperativeHandle(ref, () => ({
      close: handleHide,
    }));

    // Render trigger button/link if in self-contained mode
    const renderTrigger = () => {
      if (!trigger) return null;

      if (trigger.type === "link") {
        return (
          <span
            onClick={handleShow}
            style={{ cursor: "pointer" }}
            className={trigger.className}
            aria-label={trigger.ariaLabel || "Open Modal"}
          >
            {trigger.icon}
            {trigger.label && <span className="mx-2">{trigger.label}</span>}
          </span>
        );
      }

      // Default button trigger
      return (
        <Button
          variant={
            trigger.variant === "brand" || trigger.variant === "brandOutline"
              ? undefined
              : trigger.variant || "primary"
          }
          size={trigger.size}
          onClick={handleShow}
          className={
            trigger.variant === "brand"
              ? `${styles.brandButton} ${trigger.className || ""}`
              : trigger.variant === "brandOutline"
              ? `${styles.brandOutlineButton} ${trigger.className || ""}`
              : trigger.className
          }
          aria-label={trigger.ariaLabel || "Open Modal"}
        >
          {trigger.icon}
          {trigger.label && <span className="mx-2">{trigger.label}</span>}
        </Button>
      );
    };

    return (
      <>
        {trigger && renderTrigger()}

        <Modal
          show={show}
          onHide={handleHide}
          onEntering={onEntering}
          onExiting={onExiting}
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
                  variant={
                    button.variant === "brand" || button.variant === "brandOutline"
                      ? undefined
                      : button.variant || "primary"
                  }
                  className={
                    button.variant === "brand"
                      ? styles.brandButton
                      : button.variant === "brandOutline"
                      ? styles.brandOutlineButton
                      : undefined
                  }
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
      </>
    );
  }
);

BaseModal.displayName = "BaseModal";
