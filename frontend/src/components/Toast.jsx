import React from "react";
import { useCart } from "../context/CartContext";

const Toast = () => {
  const { toast } = useCart();

  if (!toast.visible) return null;

  return (
    <div
      className={`app-toast toast-${toast.type}`}
      role="status"
      aria-live="polite"
    >
      <span className="toast-icon" aria-hidden="true">
        {toast.type === "success" ? "✓" : "ℹ"}
      </span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
};

export default Toast;
