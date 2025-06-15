import React from "react";
import Link from "next/link";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "green";
  href?: string;
  className?: string;
}

export const Button = ({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: ButtonProps) => {
  const buttonClassName = `${styles.button} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};
