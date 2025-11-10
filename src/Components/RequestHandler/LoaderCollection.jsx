import React from "react";
import "./Style.css";

// Simple spinner loader
export const SpinnerLoader = ({ fullPage = false }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        fullPage ? "min-h-[60vh]" : "py-10"
      }`}
    >
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-blue-500 animate-spin"></div>
      </div>
    </div>
  );
};

// Dots loader
export const DotsLoader = ({ fullPage = false }) => {
  return (
    <div className={`flex -center`}>
      <div className="flex space-x-2">
        <div
          className="h-4 w-4 rounded-full bg-black animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="h-4 w-4 rounded-full bg-black animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
        <div
          className="h-4 w-4 rounded-full bg-black animate-bounce"
          style={{ animationDelay: "600ms" }}
        ></div>
      </div>
    </div>
  );
};

// Pulse loader
export const PulseLoader = ({ fullPage = false }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        fullPage ? "min-h-[60vh]" : "py-10"
      }`}
    >
      <div className="h-16 w-16 rounded-full bg-blue-500 animate-pulse"></div>
    </div>
  );
};

// Progress bar loader
export const ProgressLoader = ({ fullPage = false }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        fullPage ? "min-h-[60vh]" : "py-10"
      }`}
    >
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="loading-bar h-full"></div>
      </div>
    </div>
  );
};

// Modern circular loader with progress bar
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

// Skelton loader
export const SkeletonLoader = ({ fullPage = false }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        fullPage ? "min-h-[60vh]" : "py-10"
      }`}
    >
      <div className="w-full max-w-md">
        <div className="h-20 w-3/4 bg-gray-200 rounded-md mb-4 skelton-animation"></div>
        <div className="h-12 w-full bg-gray-200 rounded-md mb-4 skelton-animation"></div>
        <div className="h-12 w-full bg-gray-200 rounded-md mb-4 skelton-animation"></div>
      </div>
    </div>
  );
};

export default ModernLoader;
