// src/components/ui/Button.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * Reusable button component that uses design‑token CSS variables.
 * Props:
 *   - variant: "primary" | "secondary" | "ghost"
 *   - size: "sm" | "md" | "lg"
 *   - onClick, disabled, className, children
 */
export default function Button({
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  children,
  ...rest
}) {
  const base = "rounded-md font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75";
  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]",
    secondary: "bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-dark)]",
    ghost: "bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
  };
  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(["primary", "secondary", "ghost"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
