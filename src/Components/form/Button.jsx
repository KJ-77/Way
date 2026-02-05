import React from "react";
import { Link } from "react-router-dom";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  to,
  href,
  onClick,
  fullWidth = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2 text-sm",
  };

  const variantClasses = {
    primary:
      "bg-primary text-white hover:bg-primary/90 border border-primary",
    secondary:
      "bg-secondary text-white hover:bg-secondary/90 border border-secondary",
    outline:
      "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white",
    "outline-white":
      "bg-transparent text-white border border-white hover:bg-white hover:text-primary",
    ghost:
      "bg-transparent text-primary hover:bg-primary/5 border border-transparent",
    link: "bg-transparent text-primary underline hover:text-secondary border-none p-0",
  };

  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 focus:outline-none";

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  const combinedClasses = `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
    variantClasses[variant] || variantClasses.primary
  } ${widthClass} ${disabledClass} ${className}`.trim();

  // Render as React Router Link
  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  // Render as external anchor
  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  // Render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
