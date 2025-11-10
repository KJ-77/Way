import React from "react";

const FormGroup = ({ children, title, subtitle }) => {
  return (
    <div className="mb-6">
      {title && (
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
      )}
      {subtitle && <p className="text-sm text-gray-600 mb-4">{subtitle}</p>}
      {children}
    </div>
  );
};

export default FormGroup;
