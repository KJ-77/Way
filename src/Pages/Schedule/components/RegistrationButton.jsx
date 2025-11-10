import React from "react";
import { Link } from "react-router-dom";

/**
 * RegistrationButton Component
 *
 * Handles registration button states and user authentication checks
 * Shows appropriate button/link based on:
 * - Authentication state (logged in, verified)
 * - Session state (selected, full, started)
 * - Registration state (already registered)
 */
const RegistrationButton = ({
  isRegistered,
  registeredSessionIds = [], // Array of session IDs user is registered for
  isLoggedIn,
  user,
  isFull,
  authLoading,
  scheduleId,
  selectedSessionId,
  handleRegister,
  handleRequestFullClass,
  onOpenCalendar, // Handler to open the calendar modal
  sessions = [], // Session data to check start dates
}) => {
  /**
   * FULL SESSION HANDLING
   */
  if (isFull) {
    // Not logged in → prompt login
    if (!isLoggedIn) {
      return (
        <Link
          to="/auth/login"
          className="inline-block text-primary font-medium text-sm underline hover:text-primary-dark transition-colors"
        >
          Log in to Request Spot
        </Link>
      );
    }

    // Logged in but not verified → prompt verification
    if (!user?.verified) {
      return (
        <Link
          to="/auth/verify"
          className="inline-block text-primary font-medium text-sm underline hover:text-primary-dark transition-colors"
        >
          Verify Account to Request
        </Link>
      );
    }

    // Logged in + verified → allow request
    return (
      <button
        onClick={() => handleRequestFullClass(scheduleId, selectedSessionId)}
        className="text-primary font-medium text-sm underline hover:text-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={authLoading}
      >
        {authLoading ? "Processing..." : "Request a Spot"}
      </button>
    );
  }

  /**
   * AUTHENTICATION CHECKS (for non-full sessions)
   */

  // Not logged in → prompt login
  if (!isLoggedIn) {
    return (
      <Link
        to="/auth/login"
        className="inline-block text-black underline font-medium text-sm hover:text-gray-700 transition-colors"
      >
        Log in to Register
      </Link>
    );
  }

  // Logged in but not verified → prompt verification
  if (!user?.verified) {
    return (
      <Link
        to="/auth/verify"
        className="inline-block text-black underline font-medium text-sm hover:text-gray-700 transition-colors"
      >
        Verify Account to Register
      </Link>
    );
  }

  /**
   * SESSION SELECTION LOGIC
   */

  // Check if a session is selected
  const isSessionSelected = !!selectedSessionId;

  // Check if already registered for this specific session
  const isAlreadyRegisteredForThisSession =
    selectedSessionId && registeredSessionIds.includes(selectedSessionId);

  // No session selected yet → show "Select a session" button
  if (!selectedSessionId) {
    return (
      <button
        onClick={onOpenCalendar}
        className="text-primary font-medium text-sm underline hover:text-primary-dark transition-colors"
      >
        Select a session
      </button>
    );
  }

  // Already registered for this session → don't show registration button
  if (isAlreadyRegisteredForThisSession) {
    return null;
  }

  /**
   * SESSION START DATE CHECK
   */

  // Find the selected session to check if it has started
  const selectedSession = sessions.find(
    (session) => session._id === selectedSessionId
  );

  // Check if session has already started
  const hasSessionStarted = selectedSession
    ? new Date() >= new Date(selectedSession.startDate)
    : false;

  // Session has started → show disabled message
  if (hasSessionStarted) {
    return (
      <span className="text-gray-500 font-medium text-sm">
        Session has started
      </span>
    );
  }

  /**
   * REGISTRATION BUTTON (all checks passed)
   */

  // Format the date for display
  const formattedDate = selectedSession
    ? new Date(selectedSession.startDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <button
      onClick={() => handleRegister(scheduleId, selectedSessionId)}
      className="text-secondary font-medium text-sm underline hover:text-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={authLoading}
    >
      {authLoading ? (
        <span className="flex items-center gap-2 animate-pulse-smooth">
          <svg
            className="spinner-smooth h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : selectedSession ? (
        `Register for ${formattedDate} session`
      ) : (
        "Register for Class"
      )}
    </button>
  );
};

export default RegistrationButton;
