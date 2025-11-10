import React from "react";
import "./Style.css";

const ModernLoader = ({ fullPage = false }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        fullPage ? "min-h-[60vh]" : "py-10"
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-blue-500 animate-spin"></div>
        </div>
        <div className="mt-4">
          <div className="h-2 w-24 bg-gray-200 rounded-full mt-2 overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 loading-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLoader;
