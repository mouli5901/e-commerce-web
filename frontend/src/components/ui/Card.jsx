// src/components/ui/Card.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * Reusable Card component that applies surface background, radius, and shadow
 * using design‑token CSS variables.
 */
export default function Card({ children, className = "", ...rest }) {
  return (
    <div
      className={`bg-[var(--color-surface)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] p-4 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
