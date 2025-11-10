import React from "react";
import StatusIndicator from "./StatusIndicator";
import RegistrationButton from "./RegistrationButton";
import ScheduleImageGallery from "./ScheduleImageGallery";

const ScheduleItem = ({
  schedule,
  isRegistered,
  registrationStatuses,
  isLoggedIn,
  user,
  authLoading,
  handleRegister,
  handleRequestFullClass,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get registration status details
  const regStatus = registrationStatuses[schedule._id];
  const isApproved = regStatus && regStatus.status === "approved";
  const isPaid = regStatus && regStatus.paymentStatus === "paid";
  const isFull = schedule.studentCapacity <= schedule.enrolledStudents;

  return (
    <div className=" flex-1 flex flex-col">
      {/* Images Section - Swiper Slider */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center">
        <ScheduleImageGallery images={schedule.images} />
      </div>

      <div className="w-full md:w-1/2 p-4 md:p-6 relative">
        {/* Status Indicator */}
        <StatusIndicator
          isRegistered={isRegistered}
          isApproved={isApproved}
          isPaid={isPaid}
        />

        {/* Enhanced Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 pr-20">
          {schedule.title}
        </h2>

        {/* Improved Schedule Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Start Date</p>
              <p className="font-medium text-gray-800">
                {formatDate(schedule.startDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">End Date</p>
              <p className="font-medium text-gray-800">
                {formatDate(schedule.endDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Class Time</p>
              <p className="font-medium text-gray-800">{schedule.classTime}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            About this class
          </h3>
          <div
            className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: schedule.text || "No description available.",
            }}
          />
        </div>

        {/* Registration Action - Enhanced */}
        <div className="mt-auto">
          <RegistrationButton
            isRegistered={isRegistered}
            isLoggedIn={isLoggedIn}
            user={user}
            isFull={isFull}
            authLoading={authLoading}
            scheduleId={schedule._id}
            handleRegister={handleRegister}
            handleRequestFullClass={handleRequestFullClass}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleItem;
