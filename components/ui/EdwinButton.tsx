"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type EdwinButtonVariant =
  | "primary"
  | "secondary"
  | "dark"
  | "danger"
  | "red"
  | "gradientCyanPurple"
  | "gradientRedPurple"
  | "gradientSpectrum";

type EdwinButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: EdwinButtonVariant;
};

const variantClassNames: Record<EdwinButtonVariant, string> = {
  primary: "admin-button-primary",
  secondary: "admin-button-secondary",
  dark: "admin-button-dark",
  danger: "admin-button-danger",
  red: "edwin-button-red",
  gradientCyanPurple: "edwin-button-gradient-cyan-purple",
  gradientRedPurple: "edwin-button-gradient-red-purple",
  gradientSpectrum: "edwin-button-gradient-spectrum",
};

export default function EdwinButton({
  children,
  className = "",
  disabled = false,
  href,
  onClick,
  type = "button",
  variant = "primary",
}: EdwinButtonProps) {
  const buttonClassName = `${variantClassNames[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link
        href={href}
        aria-disabled={disabled}
        className={buttonClassName}
        onClick={disabled ? (event) => event.preventDefault() : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={buttonClassName}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
