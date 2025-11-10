import React, { useState } from "react";

/**
 * StatusIndicator Component
 *
 * Displays registration status badges:
 * - Pending: Awaiting admin approval (gray)
 * - Confirmed: Admin approved, user is enrolled (green)
 * - Rejected: Registration denied with reason (red)
 *
 * NOTE: Payment is handled separately/offline.
 * Admin approval = automatic enrollment (no payment step in frontend)
 */
const StatusIndicator = ({
  isRegistered,          // Registration object or null
  isApproved,           // Boolean - is registration approved
  isPaid,               // Boolean - is payment complete (not used in UI)
  selectedSessionId,    // Currently selected session ID
}) => {
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  /**
   * Don't show status if not registered
   */
  if (!isRegistered) return null;

  /**
   * Determine registration status
   */
  const regStatus = isRegistered.status || "pending"; // pending, approved, rejected
  const rejectionReason = isRegistered.rejectionReason || "";

  /**
   * STATUS BADGE RENDERING
   * Only 3 states: Pending, Confirmed, Rejected
   */

  // REJECTED STATUS
  if (regStatus === "rejected") {
    return (
      <>
        <div className="flex items-center gap-2">
          <span className="text-sm px-3 py-1 bg-red-50 text-red-700 rounded-full font-medium badge-enter">
            ✗ Rejected
          </span>
          {/* Show rejection reason button if reason exists */}
          {rejectionReason && (
            <button
              onClick={() => setShowRejectionModal(true)}
              className="text-xs text-red-600 underline hover:text-red-800"
            >
              View Reason
            </button>
          )}
        </div>

        {/* Rejection Reason Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full animate-scaleIn transform-gpu">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Registration Rejected
                </h3>
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Reason:</p>
                <p className="text-base text-gray-800 bg-gray-50 p-3 rounded">
                  {rejectionReason}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // CONFIRMED STATUS (Admin Approved = Enrolled)
  if (regStatus === "approved" || isApproved) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium badge-enter">
          ✓ Confirmed
        </span>
      </div>
    );
  }

  // PENDING STATUS (Default - Awaiting Admin)
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm px-3 py-1 bg-gray-50 text-gray-600 rounded-full font-medium badge-enter">
        ⏳ Pending
      </span>
    </div>
  );
};

export default StatusIndicator;
