import { useState, useEffect, useContext } from "react";
import useAuth from "Hooks/useAuth";
import AuthContext from "Context/AuthContext";

/**
 * useRegistration Hook
 *
 * Manages all schedule registration logic including:
 * - Authentication state checking
 * - Token expiration handling
 * - Registration status tracking
 * - Session-specific registrations
 * - Error handling and user feedback
 *
 * @returns {Object} Registration state and handlers
 */
const useRegistration = () => {
  const { postWithAuth, fetchWithAuth, loading: authLoading } = useAuth();

  // Track registrations per session (key format: "scheduleId:sessionId")
  const [registeredScheduleIds, setRegisteredScheduleIds] = useState([]);
  const [registrationStatuses, setRegistrationStatuses] = useState({}); // {scheduleId:sessionId: {status, paymentStatus, rejectionReason}}
  const { isLoggedIn, user, token, logoutHandler } = useContext(AuthContext);

  // Message state for user feedback
  const [message, setMessage] = useState({ type: null, text: null });

  /**
   * AUTHENTICATION & TOKEN MANAGEMENT
   * ================================
   */

  /**
   * Check if user session is valid
   * Tests: T001-T050 (Authentication State Tests)
   *
   * @returns {boolean} True if user can register
   */
  const canUserRegister = () => {
    // T001, T011: Check if logged in
    if (!isLoggedIn) {
      return { canRegister: false, reason: "NOT_LOGGED_IN" };
    }

    // T011, T012: Check if verified
    if (!user?.verified) {
      return { canRegister: false, reason: "NOT_VERIFIED" };
    }

    // T031-T050: Check if token exists
    if (!token) {
      return { canRegister: false, reason: "NO_TOKEN" };
    }

    return { canRegister: true };
  };

  /**
   * Handle token expiration and 401/403 errors
   * Tests: T031-T050, T291-T300 (Token Expiration)
   *
   * @param {Error} error - Error object from API
   */
  const handleAuthError = (error) => {
    // T031-T033, T049: Handle 401 Unauthorized (token expired/invalid)
    if (error.status === 401) {
      console.error("🔒 Authentication error - token expired or invalid");

      // T035-T036: Clear local storage and user state
      logoutHandler();

      // T037: Show clear error message
      setMessage({
        type: "error",
        text: "Your session has expired. Please log in again.",
      });

      // T033: Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);

      return true;
    }

    // T050: Handle 403 Forbidden (permission denied)
    if (error.status === 403) {
      console.error("🚫 Permission denied");
      setMessage({
        type: "error",
        text: "You don't have permission to perform this action.",
      });
      return true;
    }

    return false;
  };

  /**
   * REGISTRATION DATA FETCHING
   * ==========================
   */

  /**
   * Fetch user's existing registrations
   *
   * Fetches all user registrations and organizes them by scheduleId:sessionId keys
   * Each registration contains:
   * - status: pending (awaiting admin) | approved (confirmed/enrolled) | rejected (denied)
   * - rejectionReason: Admin's reason for rejection (if applicable)
   *
   * NOTE: Payment is handled offline. Admin approval = automatic enrollment.
   */
  const fetchUserRegistrations = async () => {
    // T010, T016: Don't fetch if not logged in or verified
    if (!isLoggedIn || !user?.verified || !token) {
      return;
    }

    try {
      console.log("📥 Fetching user registrations...");

      const result = await fetchWithAuth(
        "/registrations/my-registrations",
        token
      );

      if (result.data && result.data.registrations) {
        const registeredIds = [];
        const statusMap = {};

        // T211-T220: Process each registration separately per session
        result.data.registrations
          .filter(
            (reg) => reg.scheduleId && reg.scheduleId._id && reg.sessionId
          )
          .forEach((reg) => {
            // Track schedule IDs for convenience
            if (!registeredIds.includes(reg.scheduleId._id)) {
              registeredIds.push(reg.scheduleId._id);
            }

            // Store complete status in map keyed by scheduleId:sessionId
            const key = `${reg.scheduleId._id}:${reg.sessionId}`;
            statusMap[key] = {
              status: reg.status, // pending | approved | rejected
              paymentStatus: reg.paymentStatus, // Kept for backend compatibility (not shown in UI)
              rejectionReason: reg.rejectionReason || "", // Admin's rejection reason
            };
          });

        console.log(`✅ Loaded ${result.data.registrations.length} registrations`);
        console.log("📊 Status map:", statusMap);

        // T124, T136, T149: Update state (persists across refresh via re-fetch on mount)
        setRegisteredScheduleIds(registeredIds);
        setRegistrationStatuses(statusMap);
      }
    } catch (error) {
      console.error("❌ Failed to fetch user registrations:", error);

      // T031-T050: Handle authentication errors
      if (handleAuthError(error)) {
        return;
      }

      // T271-T280: Handle network errors gracefully (don't block UI)
      console.warn("⚠️ Could not load registrations, continuing anyway");
    }
  };

  /**
   * LIFECYCLE EFFECTS
   * =================
   */

  // T017-T018, T024, T027: Fetch registrations on mount if user is verified
  useEffect(() => {
    if (isLoggedIn && user?.verified) {
      fetchUserRegistrations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user]);

  // T307: Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: null, text: null });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  /**
   * REGISTRATION HANDLERS
   * =====================
   */

  /**
   * Handle user registration for a specific session
   * Tests: T021-T030, T121-T144, T181-T210, T281-T290
   *
   * @param {string} scheduleId - ID of the schedule
   * @param {string} sessionId - ID of the specific session
   */
  const handleRegister = async (scheduleId, sessionId) => {
    console.log(`🎯 Registration attempt: Schedule ${scheduleId}, Session ${sessionId}`);

    /**
     * PRE-REGISTRATION VALIDATION
     * ==========================
     */

    // T001-T003: Check if user is logged in
    if (!isLoggedIn) {
      console.warn("⚠️ User not logged in");
      setMessage({
        type: "info",
        text: "Please log in to register for this schedule.",
      });
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1500);
      return;
    }

    // T011-T012: Check if user is verified
    if (!user?.verified) {
      console.warn("⚠️ User not verified");
      setMessage({
        type: "info",
        text: "Please verify your email to register for schedules.",
      });
      setTimeout(() => {
        window.location.href = "/auth/verify";
      }, 1500);
      return;
    }

    // T186: Validate session ID is provided
    if (!sessionId) {
      console.error("❌ No session ID provided");
      setMessage({
        type: "error",
        text: "Please select a session date first.",
      });
      return;
    }

    // T291-T294: Validate IDs are present
    if (!scheduleId || !sessionId) {
      console.error("❌ Missing required IDs");
      setMessage({
        type: "error",
        text: "Invalid registration request. Please try again.",
      });
      return;
    }

    /**
     * DUPLICATE REGISTRATION CHECK
     * ===========================
     */

    // T213-T214: Check if already registered for THIS specific session
    const registrationKey = `${scheduleId}:${sessionId}`;

    if (registrationStatuses[registrationKey]) {
      console.log(`ℹ️ Already registered for ${registrationKey}`);
      console.log("Current registered sessions:", Object.keys(registrationStatuses)
        .filter((k) => k.startsWith(`${scheduleId}:`))
      );

      // User already registered for this exact session
      const existingReg = registrationStatuses[registrationKey];

      // Provide specific feedback based on status
      let messageText = "You're already registered for this session.";

      // Pending status - awaiting admin approval
      if (existingReg.status === "pending") {
        messageText = "Your registration is pending admin approval.";
      }
      // Approved status - confirmed and enrolled (no payment step)
      else if (existingReg.status === "approved") {
        messageText = "You're already confirmed for this session.";
      }
      // Rejected status - allow re-registration
      else if (existingReg.status === "rejected") {
        // Allow re-registration for rejected registrations
        console.log("Previous registration was rejected, allowing re-registration");
        // Don't return, continue with registration
      }

      // Only block if not rejected
      if (existingReg.status !== "rejected") {
        setMessage({
          type: "info",
          text: messageText,
        });
        return;
      }
    }

    /**
     * SUBMIT REGISTRATION
     * ==================
     */

    try {
      console.log(`📤 Submitting registration for ${registrationKey}`);

      // T281-T283: Prevent concurrent submissions (loading state handled by useAuth)
      const response = await postWithAuth("/registrations", token, {
        scheduleId,
        sessionId,
      });

      console.log("✅ Registration response:", response);

      /**
       * OPTIMISTIC UPDATE
       * T132-T143: Immediately update local state
       */

      // Add to registered schedule IDs
      setRegisteredScheduleIds((prev) =>
        Array.from(new Set([...prev, scheduleId]))
      );

      // Set initial status to pending
      setRegistrationStatuses((prev) => ({
        ...prev,
        [registrationKey]: {
          status: "pending",
          paymentStatus: "unpaid", // Kept for backend compatibility
          rejectionReason: "",
        },
      }));

      // Show success message
      setMessage({
        type: "success",
        text: "Registration submitted! Awaiting admin confirmation.",
      });

      // T128: Refresh registrations after a short delay to get server state
      setTimeout(() => {
        fetchUserRegistrations();
      }, 1000);

    } catch (error) {
      console.error("❌ Registration error:", error);
      console.log("Error details:", {
        type: typeof error,
        status: error.status,
        message: error.message,
        data: error.data,
      });

      /**
       * ERROR HANDLING
       * =============
       */

      // T031-T050: Handle authentication errors first
      if (handleAuthError(error)) {
        return;
      }

      let errorMessage = "Failed to register. Please try again.";

      // T290: Handle 409 Conflict (already registered)
      const isConflict =
        error.status === 409 ||
        error.statusCode === 409 ||
        (error.data && error.data.statusCode === 409);

      if (isConflict) {
        console.log("⚠️ Conflict detected - already registered");

        // Update local state to match server
        setRegisteredScheduleIds((prev) =>
          Array.from(new Set([...prev, scheduleId]))
        );

        setRegistrationStatuses((prev) => ({
          ...prev,
          [registrationKey]: {
            status: "pending",
            paymentStatus: "unpaid",
            rejectionReason: "",
          },
        }));

        errorMessage = "You've already registered for this session.";

        // Refresh to get actual server state
        fetchUserRegistrations();
      }
      // T201-T204: Handle session already started
      else if (error.message && error.message.includes("already started")) {
        errorMessage = "This session has already started. Registration is closed.";
      }
      // T295-T296: Handle not found errors
      else if (error.status === 404) {
        errorMessage = "Schedule or session not found. It may have been removed.";
      }
      // T271-T280: Handle server errors
      else if (error.status === 500) {
        errorMessage = "Server error. Please try again in a moment.";

        // Refresh registrations to ensure consistent state
        setTimeout(() => {
          fetchUserRegistrations();
        }, 1000);
      }
      // T271-T280: Handle network errors
      else if (!error.status) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      // Use server message if available
      else if (error.message) {
        errorMessage = error.message;
      }

      // T306: Show clear, actionable error message
      setMessage({
        type: "error",
        text: errorMessage,
      });
    }
  };

  /**
   * Handle request to join a full class
   * Tests: T193, T217-T226
   *
   * @param {string} scheduleId - ID of the schedule
   * @param {string} sessionId - ID of the full session
   */
  const handleRequestFullClass = async (scheduleId, sessionId) => {
    console.log(`🎯 Full class request: Schedule ${scheduleId}, Session ${sessionId}`);

    /**
     * AUTHENTICATION CHECKS
     */

    // T004: Check if logged in
    if (!isLoggedIn) {
      console.warn("⚠️ User not logged in");
      setMessage({
        type: "info",
        text: "Please log in to request a spot.",
      });
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1500);
      return;
    }

    // T012: Check if verified
    if (!user?.verified) {
      console.warn("⚠️ User not verified");
      setMessage({
        type: "info",
        text: "Please verify your email to request a spot.",
      });
      setTimeout(() => {
        window.location.href = "/auth/verify";
      }, 1500);
      return;
    }

    /**
     * SUBMIT REQUEST
     */

    try {
      console.log(`📤 Submitting full class request for ${scheduleId}:${sessionId}`);

      await postWithAuth("/registrations/request-full-class", token, {
        scheduleId,
        sessionId,
        message: "User requesting to join a fully booked class",
      });

      // Optimistic update
      setRegisteredScheduleIds((prev) =>
        Array.from(new Set([...prev, scheduleId]))
      );

      setRegistrationStatuses((prev) => ({
        ...prev,
        [`${scheduleId}:${sessionId}`]: {
          status: "pending",
          paymentStatus: "unpaid",
          rejectionReason: "",
        },
      }));

      setMessage({
        type: "success",
        text: "Your request has been sent! You'll be notified if a spot opens up.",
      });

      // Refresh registrations
      setTimeout(() => {
        fetchUserRegistrations();
      }, 1000);

    } catch (error) {
      console.error("❌ Full class request error:", error);

      // Handle authentication errors
      if (handleAuthError(error)) {
        return;
      }

      let errorMessage = "Failed to send request. Please try again.";

      // Handle conflict error
      const isConflict =
        error.status === 409 ||
        error.statusCode === 409 ||
        (error.data && error.data.statusCode === 409);

      if (isConflict) {
        console.log("⚠️ Conflict - already requested or registered");

        setRegisteredScheduleIds((prev) =>
          Array.from(new Set([...prev, scheduleId]))
        );

        errorMessage = "You've already requested a spot for this session.";

        // Refresh to get server state
        fetchUserRegistrations();
      }
      else if (error.message) {
        errorMessage = error.message;
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    }
  };

  /**
   * PUBLIC API
   * ==========
   */

  return {
    // Registration state
    registeredScheduleIds,      // Array of schedule IDs user is registered for
    registrationStatuses,        // Map of scheduleId:sessionId to {status, paymentStatus, rejectionReason}

    // User feedback
    message,                     // {type: 'success'|'error'|'info', text: string}

    // Loading state
    authLoading,                 // Boolean indicating API call in progress

    // Actions
    handleRegister,              // Function to register for a session
    handleRequestFullClass,      // Function to request spot in full session

    // Authentication state
    isLoggedIn,                  // Boolean
    user,                        // User object with verified flag
  };
};

export default useRegistration;
