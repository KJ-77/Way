import { useEffect } from "react";
import useFetch from "Hooks/useFetch";
import Container from "Components/Container/Container";
import { IsError, DotsLoader } from "Components/RequestHandler";
import WeeklyGrid from "./components/WeeklyGrid";

// Public weekly schedule page — anyone can view what classes Way is running this week.
// Backed by the public GET /schedule endpoint. Bookings/registrations are NOT
// surfaced here on purpose — those flow through the /classes (packages) catalog.
const WeeklySchedule = () => {
  const { data, loading, error, fetchData } = useFetch();

  useEffect(() => {
    fetchData("/schedule");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The live backend returns a plain array; older mock-shaped responses (kept for safety)
  // wrap rows in a `.data` field. Accept either.
  const slots = Array.isArray(data) ? data : data?.data ?? [];

  if (loading) {
    return (
      <div className="flex flex-col gap-4 min-h-[60vh] items-center justify-center">
        <DotsLoader />
        <p className="text-xl font-bold">Loading schedule…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <IsError message={error.message} />
      </div>
    );
  }

  return (
    <Container className="my-6 sm:my-secondary md:my-primary lg:my-large">
      {/* Heading */}
      <div className="flex flex-col gap-4 lg:gap-6 mb-10 lg:mb-secondary max-w-2xl">
        <h1 className="text-3xl lg:text-5xl font-light text-[#5a4434]">
          This week at <span className="italic">Way</span>
        </h1>
        <p className="text-lg lg:text-xl text-[#7a5d4d]">
          A look at the classes running this week. Subscribed to one of these?
          Drop in any time during your session.
        </p>
      </div>

      {/* Grid (or empty state) */}
      {slots.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
          <p className="text-gray-600">No classes scheduled this week.</p>
          <p className="text-sm text-gray-400 mt-1">Check back soon.</p>
        </div>
      ) : (
        <WeeklyGrid slots={slots} />
      )}
    </Container>
  );
};

export default WeeklySchedule;
