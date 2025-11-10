import React from "react";
import useInView from "../../../Hooks/useInView";
import ScheduleImageGallery from "./ScheduleImageGallery";
import StatusIndicator from "./StatusIndicator";
import RegistrationButton from "./RegistrationButton";
import SessionCalendar from "./SessionCalendar";

const ScheduleCard = ({
  schedule,
  registrationStatuses,
  isLoggedIn,
  user,
  authLoading,
  handleRegister,
  handleRequestFullClass,
}) => {
  // Get registration status details - start with no session selected
  const [selectedSessionId, setSelectedSessionId] = React.useState("");

  const key = selectedSessionId ? `${schedule._id}:${selectedSessionId}` : null;
  const regStatus = key ? registrationStatuses[key] : null;
  const isApproved = regStatus && regStatus.status === "approved";
  const isPaid = regStatus && regStatus.paymentStatus === "paid";

  // We'll allow registration for multiple sessions, but track it for display purposes
  const registeredSessionIds = Object.keys(registrationStatuses || {})
    .filter((key) => key.startsWith(`${schedule._id}:`))
    .map((key) => key.split(":")[1]);
  // Determine fullness: find selected session metrics if available
  const selectedSession = (schedule.sessions || []).find(
    (s) => s._id === selectedSessionId
  );
  const [capacityMap, setCapacityMap] = React.useState({}); // sessionId -> { paid, total }
  React.useEffect(() => {
    // fetch capacity per session for this schedule
    const load = async () => {
      try {
        const res = await fetch(
          `/api/registrations/schedule/${schedule._id}/capacity`
        );
        const data = await res.json();
        if (data?.data?.sessions) {
          const map = {};
          data.data.sessions.forEach((s) => {
            map[s.sessionId] = { paid: s.paid, total: s.totalCapacity };
          });
          setCapacityMap(map);
        }
      } catch (e) {
        // ignore
      }
    };
    load();
  }, [schedule._id]);

  const sessionCapacity =
    selectedSession?.capacity || capacityMap[selectedSessionId]?.total || 0;
  const sessionPaid = capacityMap[selectedSessionId]?.paid || 0;
  const isFull = sessionCapacity > 0 ? sessionPaid >= sessionCapacity : false;

  // Remove unused formatDate and formatSessionLabel functions

  // State to control calendar visibility
  const [showCalendar, setShowCalendar] = React.useState(false);

  // Handler to open calendar
  const handleOpenCalendar = () => {
    setShowCalendar(true);
  };

  // Reveal-on-scroll animation (fade-in + subtle scale)
  const { ref, isInView } = useInView(
    { threshold: 0.15, root: null, rootMargin: "0px 0px -10% 0px" },
    false
  );

  return (
    <div
      ref={ref}
      className={
        "flex flex-col h-full will-change-transform will-change-opacity transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] " +
        (isInView
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-[0.98]")
      }
    >
      {/* Calendar Modal - Only shown when triggered */}
      {showCalendar &&
        Array.isArray(schedule.sessions) &&
        schedule.sessions.length > 0 && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-3 sm:px-4 animate-fadeIn">
            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-2xl max-w-[95%] sm:max-w-sm md:max-w-md w-full animate-scaleIn transform-gpu">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-medium">
                  Select a Session Date
                </h3>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="text--400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6"
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
              <SessionCalendar
                sessions={schedule.sessions}
                selectedSessionId={selectedSessionId}
                onSelectSession={(sessionId) => {
                  setSelectedSessionId(sessionId);
                }}
                showCalendar={true}
                setShowCalendar={setShowCalendar}
              />
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
                <button
                  onClick={() => setShowCalendar(false)}
                  className="text-gray-600 text-sm sm:text-base order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedSessionId) {
                      setShowCalendar(false);
                      // Only proceed with registration if not already registered for this session
                      const isAlreadyRegistered =
                        registeredSessionIds.includes(selectedSessionId);
                      if (!isAlreadyRegistered) {
                        handleRegister(schedule._id, selectedSessionId);
                      }
                    }
                  }}
                  className="text-black underline font-medium text-sm sm:text-base order-1 sm:order-2"
                  disabled={!selectedSessionId}
                >
                  {!selectedSessionId
                    ? "Please select a session"
                    : registeredSessionIds.includes(selectedSessionId)
                    ? "Select this session"
                    : (() => {
                        // Find selected session to format date
                        const session = (schedule.sessions || []).find(
                          (s) => s._id === selectedSessionId
                        );
                        if (session) {
                          const date = new Date(
                            session.startDate
                          ).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          });
                          return `Register for ${date} session`;
                        }
                        return "Register for this session";
                      })()}
                </button>
              </div>
            </div>
          </div>
        )}
      {/* Image Gallery */}
      <div className="w-full relative ">
        <div className="absolute top-2 right-2 z-[100]">
          {isFull && (
            <span className="text-sm px-3 py-1 rounded-full font-medium bg-red-200 text-red-700">
              {"Fully Booked"}
            </span>
          )}
        </div>
        <ScheduleImageGallery images={schedule.images} />
      </div>

      {/* Content Section */}
      <div className="relative flex-grow">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl italic text-primary font-medium text-gray-900 mt-4 sm:mt-5 mb-3 sm:mb-4">
          {schedule.title}
        </h2>

        {/* Always display selected session if one is chosen, regardless of registration status */}
        {/* {selectedSessionId && selectedSession && (
          <div className="mb-6">
            <p className="text-">Selected Session:</p>
            <p className="font-medium text-gray-800">
              {new Date(selectedSession.startDate).toLocaleDateString(
                undefined,
                {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )}
              {selectedSession.time && ` • ${selectedSession.time}`}
            </p>
            <button
              onClick={handleOpenCalendar}
              className="text-xs sm:text-sm text-gray-500 mt-1 hover:text-black underline"
            >
              Change
            </button>

            {registeredSessionIds.includes(selectedSessionId) && (
              <div className="mt-2 text-sm text-gray-500">
                Already registered
              </div>
            )}
          </div>
        )} */}

        {/* Description */}
        <div className="mb-6">
          <div
            className="text-primary font-medium"
            dangerouslySetInnerHTML={{
              __html: schedule.text || "No description available.",
            }}
          />
        </div>

        {/* Price */}
        {schedule.price > 0 && (
          <div className="mb-4">
            <span className="text-2xl font-bold text-primary">
              ${schedule.price}
            </span>
          </div>
        )}

        {/* Registration Button */}
        <div className="mt-auto flex items-center gap-6">
          <button className="text-primary font-medium text-sm underline">
            Download schedule
          </button>
          <RegistrationButton
            isRegistered={!!regStatus}
            registeredSessionIds={registeredSessionIds}
            isLoggedIn={isLoggedIn}
            user={user}
            isFull={isFull}
            authLoading={authLoading}
            scheduleId={schedule._id}
            selectedSessionId={selectedSessionId}
            handleRegister={handleRegister}
            handleRequestFullClass={handleRequestFullClass}
            onOpenCalendar={handleOpenCalendar}
            sessions={schedule.sessions || []}
          />

          <StatusIndicator
            isRegistered={regStatus}
            isApproved={isApproved}
            isPaid={isPaid}
            selectedSessionId={selectedSessionId}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
