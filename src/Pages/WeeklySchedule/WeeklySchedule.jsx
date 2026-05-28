import { useEffect, useState, useCallback } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import useFetch from "Hooks/useFetch";
import Container from "Components/Container/Container";
import { IsError, DotsLoader } from "Components/RequestHandler";
import WeeklyGrid from "./components/WeeklyGrid";
import { getBeirutWeekStart, addDays, formatWeekRange } from "Helpers/BeirutWeek";

// Public weekly schedule page — anyone can view what classes Way is running
// this week. Backed by the public GET /schedule?week= endpoint. The grid
// reflects per-week overrides (cancellations, fully-booked) merged in by the
// backend, so customers see the actual state of the week they're viewing.
const WeeklySchedule = () => {
  // Track which week the user is currently viewing. Default: current Beirut week.
  // Future weeks are useful so customers can see planned closures ahead of time.
  const [weekStart, setWeekStart] = useState(() => getBeirutWeekStart());
  const { data, loading, error, fetchData } = useFetch();

  // Refetch every time the user moves between weeks
  useEffect(() => {
    fetchData(`/schedule?week=${weekStart}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  const slots = data?.slots ?? [];

  const goToPreviousWeek = useCallback(() => setWeekStart((w) => addDays(w, -7)), []);
  const goToNextWeek = useCallback(() => setWeekStart((w) => addDays(w, 7)), []);
  const goToCurrentWeek = useCallback(() => setWeekStart(getBeirutWeekStart()), []);
  const isCurrentWeek = weekStart === getBeirutWeekStart();

  if (loading && !data) {
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
      {/* Heading + week navigator */}
      <div className="flex flex-col gap-6 mb-10 lg:mb-secondary">
        <div className="flex flex-col gap-4 lg:gap-6 max-w-2xl">
          <h1 className="text-3xl lg:text-5xl font-light text-[#5a4434]">
            {isCurrentWeek ? (
              <>This week at <span className="italic">Way</span></>
            ) : (
              <>Schedule at <span className="italic">Way</span></>
            )}
          </h1>
          <p className="text-lg lg:text-xl text-[#7a5d4d]">
            A look at the classes running this week. Subscribed to one of these?
            Drop in any time during your session.
          </p>
        </div>

        {/* Week navigator pill */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-[#5a4434]/30 bg-white">
            <button
              type="button"
              onClick={goToPreviousWeek}
              aria-label="Previous week"
              className="px-3 py-2 text-[#5a4434] hover:bg-[#5a4434]/5 rounded-l-full transition"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <div className="px-4 py-2 text-center min-w-[10rem] border-x border-[#5a4434]/15">
              <div className="text-[10px] uppercase tracking-widest text-[#a6826e]">Week of</div>
              <div className="text-sm font-medium text-[#5a4434] tabular-nums">
                {formatWeekRange(weekStart)}
              </div>
            </div>
            <button
              type="button"
              onClick={goToNextWeek}
              aria-label="Next week"
              className="px-3 py-2 text-[#5a4434] hover:bg-[#5a4434]/5 rounded-r-full transition"
            >
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
          {!isCurrentWeek && (
            <button
              type="button"
              onClick={goToCurrentWeek}
              className="text-sm text-[#5a4434] underline-offset-4 hover:underline"
            >
              Back to this week
            </button>
          )}
        </div>
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
