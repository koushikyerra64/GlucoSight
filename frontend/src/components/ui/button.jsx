import React from "react";

export function Button({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}