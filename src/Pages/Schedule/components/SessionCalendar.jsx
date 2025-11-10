import React, { useState, useEffect } from "react";

const SessionCalendar = ({
  sessions,
  selectedSessionId,
  onSelectSession,
  showCalendar = false, // Allow external control of calendar visibility
  setShowCalendar = () => {}, // Default no-op function
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sessionDates, setSessionDates] = useState({});
  const calendarRef = React.useRef(null);

  // Parse session dates and create a map of date -> sessionId
  // Fix to ensure dates are properly normalized to avoid timezone issues
  useEffect(() => {
    const dateMap = {};
    sessions.forEach((session) => {
      if (session.startDate) {
        // Create a date with no time part to avoid timezone issues
        const sessionDate = new Date(session.startDate);
        // Use UTC methods to avoid timezone issues
        const normalizedDate = new Date(
          Date.UTC(
            sessionDate.getFullYear(),
            sessionDate.getMonth(),
            sessionDate.getDate()
          )
        )
          .toISOString()
          .split("T")[0];

        dateMap[normalizedDate] = session._id;

        // Debug output to help identify any issues
        console.log(
          `Session date: ${session.startDate}, Normalized: ${normalizedDate}, Session ID: ${session._id}`
        );
      }
    });
    console.log("Session dates map:", dateMap);
    setSessionDates(dateMap);
  }, [sessions]);

  // Selected session now handled by parent component

  // Click outside to close calendar
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowCalendar]);

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      // Create normalized date with no time part to match the session dates
      // Use UTC to avoid timezone issues
      const normalizedDate = new Date(Date.UTC(year, month, i))
        .toISOString()
        .split("T")[0];

      // Debug output to help identify any calendar highlighting issues
      if (normalizedDate in sessionDates) {
        console.log(
          `Calendar day ${i} (${normalizedDate}) has session: ${sessionDates[normalizedDate]}`
        );
      }

      days.push({
        day: i,
        isCurrentMonth: true,
        hasSession: normalizedDate in sessionDates,
        sessionId: sessionDates[normalizedDate],
      });
    }

    return days;
  };

  // Previous month handler
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Next month handler
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Format month name
  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Handle day click
  const handleDayClick = (day) => {
    if (day.hasSession) {
      onSelectSession(day.sessionId);
      setShowCalendar(false);
    }
  };

  const calendarDays = generateCalendarDays();

  // No button reference needed in modal mode

  return (
    <div className="relative w-full">
      <div ref={calendarRef} className="w-full bg-white px-1 sm:px-2">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h3 className="text-lg font-medium text-gray-900">
            {formatMonthYear()}
          </h3>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-gray-500">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-1">
              {day.charAt(0)}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px sm:gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => day.hasSession && handleDayClick(day)}
              className={`
                   h-8 sm:h-10 w-full flex items-center justify-center rounded-full text-xs sm:text-sm font-medium
                   ${!day.isCurrentMonth ? "invisible" : ""}
                   ${
                     day.hasSession
                       ? "cursor-pointer hover:bg-primary hover:text-white font-bold"
                       : "text-gray-400"
                   }
                   ${
                     day.sessionId === selectedSessionId
                       ? "bg-black text-white hover:bg-gray-800 border border-black"
                       : day.hasSession
                       ? "bg-secondary text-white border border-gray-300"
                       : ""
                   }
                 `}
            >
              {day.day}
            </div>
          ))}
        </div>

        <div className="mt-4 p-2 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-xs font-medium text-center text-blue-800">
            Only highlighted dates have available sessions
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionCalendar;
