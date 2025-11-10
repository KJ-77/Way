import React from "react";
import Container from "Components/Container/Container";

const EmptyScheduleState = () => {
  return (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="text-center py-8 px-4 max-w-sm mx-auto">
        <div className="w-12 h-12 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          No Classes Available
        </h2>
        <p className="text-gray-500 text-sm">
          Check back soon for new class schedules
        </p>
      </div>
    </Container>
  );
};

export default EmptyScheduleState;
