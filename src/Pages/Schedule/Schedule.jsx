import React from "react";
import useFetch from "Hooks/useFetch";
import { IsError, DotsLoader } from "Components/RequestHandler";
import Container from "Components/Container/Container";
import "./Schedule.css";

// Import custom hooks
import useRegistration from "./hooks/useRegistration";

// Import components
import {
  EmptyScheduleState,
  MessageNotification,
  ScheduleCard,
  useSwiperStyles,
} from "./components";

const Schedule = () => {
  const { data: schedules, loading, error, fetchData } = useFetch();
  const {
    registeredScheduleIds,
    registrationStatuses,
    message,
    authLoading,
    handleRegister,
    handleRequestFullClass,
    isLoggedIn,
    user,
  } = useRegistration();

  // Add Swiper styles to document
  useSwiperStyles();

  // On component mount, fetch schedules
  React.useEffect(() => {
    // Get all schedules
    fetchData("/schedule");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 min-h-[80vh] items-center justify-center ">
        <DotsLoader />
        <p className="text-xl font-bold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <IsError message={error.message} />
      </div>
    );
  }

  if (!schedules?.data || schedules.data.length === 0) {
    return (
      <div>
        <EmptyScheduleState />
      </div>
    );
  }

  return (
    <Container className="my-6 sm:my-secondary  md:my-primary lg:my-large">
      {/* Message notification */}
      <MessageNotification message={message} />

      <div className="">
        {/* Title and Description Section */}
        <div className="flex flex-col md:items-end justify-center gap-4 lg:gap-8 text-primary md:w-3/4  lg:w-[60%]  ">
          <h1 className="me:text-end lg:text-5xl text-3xl font-light  ">
            Our <span className="italic">Schedule</span>
          </h1>

          <p className="text-xl lg:text-2xl">
            Discover our schedule and join a session that inspires you
          </p>
        </div>

        {/* Schedule Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 lg:gap-8 px-4 sm:px-6 md:px-4 lg:px-0 mt-12  lg:mt-secondary">
          {schedules.data.map((schedule, index) => {
            // Check if this schedule is in the user's registrations
            const isRegistered = registeredScheduleIds.includes(schedule._id);

            return (
              <ScheduleCard
                key={schedule._id}
                schedule={schedule}
                isRegistered={isRegistered}
                registrationStatuses={registrationStatuses}
                isLoggedIn={isLoggedIn}
                user={user}
                authLoading={authLoading}
                handleRegister={handleRegister}
                handleRequestFullClass={handleRequestFullClass}
              />
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default Schedule;
