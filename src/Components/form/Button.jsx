import React from "react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  fullWidth = false,
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "px-4 py-2 rounded-md transition-colors text-sm font-medium focus:outline-none";

  const variantClasses = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-white text-black border border-gray-300 hover:bg-gray-100",
    link: "bg-transparent text-black underline hover:text-gray-700 p-0",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
