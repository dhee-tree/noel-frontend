"use client";

import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import styles from "./InfoTooltip.module.css";

interface InfoTooltipProps {
  content: string | React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
  iconClassName?: string;
  size?: "sm" | "md" | "lg";
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  placement = "top",
  className,
  iconClassName,
  size = "md",
}) => {
  const sizeClass = styles[`icon-${size}`];

  return (
    <OverlayTrigger
      placement={placement}
      overlay={
        <Tooltip id={`tooltip-${Math.random()}`} className={styles.tooltip}>
          {content}
        </Tooltip>
      }
      popperConfig={{
        modifiers: [
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport",
            },
          },
        ],
      }}
    >
      <span className={`${styles.iconWrapper} ${className || ""}`}>
        <FaInfoCircle className={`${styles.icon} ${sizeClass} ${iconClassName || ""}`} />
      </span>
    </OverlayTrigger>
  );
};
