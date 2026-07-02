import { useEffect, useState, useCallback, useMemo, useContext } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import useFetch from "Hooks/useFetch";
import Container from "Components/Container/Container";
import { IsError, DotsLoader } from "Components/RequestHandler";
import AuthContext from "Context/AuthContext";
import { apiFetch } from "../../lib/api";
import WeeklyGrid from "./components/WeeklyGrid";
import BookingModal from "./components/BookingModal";
import { getBeirutWeekStart, getBeirutToday, addDays, formatWeekRange } from "Helpers/BeirutWeek";

// Behind <ProtectedRoute> — every viewer is logged in. In addition to the
// weekly slots, we fetch the user's own subscriptions and use them to compute
// per-slot booking eligibility. A slot is bookable if:
//   • The user has an active sub whose package.class_type_id matches the slot
//   • That sub has remaining_sessions > 0 and hasn't expired
//   • The slot is in the future (or today) for the currently-viewed week
//   • The slot isn't cancelled or fully-booked for this week
const WeeklySchedule = () => {
  const { user } = useContext(AuthContext);
  const [weekStart, setWeekStart] = useState(() => getBeirutWeekStart());
  const { data, loading, error, fetchData } = useFetch();

  // Separate hook for /user-packages — clients see their own subs (backend
  // force-filters to the caller's sub for source_pool='client').
  const [subs, setSubs] = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);

  // Refetch schedule when the user pages between weeks.
  useEffect(() => {
    fetchData(`/schedule?week=${weekStart}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  // Fetch subs once on mount (they don't change per-week). Refreshes after
  // every booking via `refreshSubs` below.
  const refreshSubs = useCallback(async () => {
    setSubsLoading(true);
    try {
      const res = await apiFetch("/user-packages");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = await res.json();
      setSubs(Array.isArray(rows) ? rows : []);
    } catch {
      // Non-fatal — user just won't see any Book buttons. The rest of the
      // schedule renders fine.
      setSubs([]);
    } finally {
      setSubsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) refreshSubs();
  }, [user, refreshSubs]);

  // Set of class_type_ids that this user's active, non-depleted subs cover.
  // O(1) membership check downstream. Values in this Set are used both for the
  // "is this slot bookable?" predicate and for filtering eligible subs when we
  // pass them into the modal.
  const eligibleClassTypeIds = useMemo(() => {
    const ids = new Set();
    for (const sub of subs) {
      if (
        sub.class_type_id &&
        Number(sub.remaining_sessions) > 0 &&
        sub.status !== "expired" &&
        sub.status !== "depleted"
      ) {
        ids.add(sub.class_type_id);
      }
    }
    return ids;
  }, [subs]);

  const currentWeekStart = useMemo(() => getBeirutWeekStart(new Date()), []);
  // For "is this slot in the past" we compare the slot's actual calendar date
  // (weekStart + day_of_week) against today (Beirut). Matches the backend's
  // PAST_BOOKING guard so we don't offer a Book button that will 400.
  const isSlotBookable = useCallback(
    (slot) => {
      if (!slot || slot.is_cancelled || slot.is_fully_booked) return false;
      if (!eligibleClassTypeIds.has(slot.class_type_id)) return false;
      const classDate = addDays(weekStart, slot.day_of_week);
      return classDate >= getBeirutToday();
    },
    [eligibleClassTypeIds, weekStart]
  );

  // Modal state — bookingContext carries {slot, classDate, eligibleSubs}.
  const [bookingContext, setBookingContext] = useState(null);

  const handleBookSlot = useCallback(
    (slot) => {
      const classDate = addDays(weekStart, slot.day_of_week);
      const eligibleSubs = subs.filter(
        (s) =>
          s.class_type_id === slot.class_type_id &&
          Number(s.remaining_sessions) > 0 &&
          s.status !== "expired" &&
          s.status !== "depleted"
      );
      if (eligibleSubs.length === 0) return; // Shouldn't happen if isSlotBookable said yes
      setBookingContext({ slot, classDate, eligibleSubs });
    },
    [subs, weekStart]
  );

  const handleBookingSuccess = useCallback(async () => {
    setBookingContext(null);
    // Refetch both — the slot's attending_count changes and the sub's
    // remaining_sessions decrements.
    await Promise.all([fetchData(`/schedule?week=${weekStart}`), refreshSubs()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart, refreshSubs]);

  const slots = data?.slots ?? [];

  const goToPreviousWeek = useCallback(() => setWeekStart((w) => addDays(w, -7)), []);
  const goToNextWeek = useCallback(() => setWeekStart((w) => addDays(w, 7)), []);
  const goToCurrentWeek = useCallback(() => setWeekStart(getBeirutWeekStart()), []);
  const isCurrentWeek = weekStart === currentWeekStart;

  if ((loading && !data) || subsLoading) {
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
            A look at the classes running this week. Book any class your
            subscription covers.
          </p>
        </div>

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

      {slots.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
          <p className="text-gray-600">No classes scheduled this week.</p>
          <p className="text-sm text-gray-400 mt-1">Check back soon.</p>
        </div>
      ) : (
        <WeeklyGrid
          slots={slots}
          isSlotBookable={isSlotBookable}
          onBookSlot={handleBookSlot}
        />
      )}

      {bookingContext && (
        <BookingModal
          slot={bookingContext.slot}
          classDate={bookingContext.classDate}
          eligibleSubs={bookingContext.eligibleSubs}
          onClose={() => setBookingContext(null)}
          onBooked={handleBookingSuccess}
        />
      )}
    </Container>
  );
};

export default WeeklySchedule;
