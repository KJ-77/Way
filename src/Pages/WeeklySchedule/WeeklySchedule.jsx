import { useEffect, useState, useCallback, useMemo, useContext } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import useFetch from "Hooks/useFetch";
import Container from "Components/Container/Container";
import { IsError, DotsLoader } from "Components/RequestHandler";
import AuthContext from "Context/AuthContext";
import { apiFetch } from "../../lib/api";
import WeeklyGrid from "./components/WeeklyGrid";
import SlotActionsModal from "./components/SlotActionsModal";
import BookingModal from "./components/BookingModal";
import ContactStaffModal from "./components/ContactStaffModal";
import { getBeirutWeekStart, getBeirutToday, addDays, formatWeekRange } from "Helpers/BeirutWeek";

// Behind <ProtectedRoute> — every viewer is logged in. Every slot is clickable
// (cancelled + past slots excepted). Clicking opens an actions picker with
// "Book a class" and "Buy subscription". From there the flow branches into
// either BookingModal (client has an eligible sub) or ContactStaffModal
// (client needs to reach out to Way to book or buy).
const WeeklySchedule = () => {
  const { user } = useContext(AuthContext);
  const [weekStart, setWeekStart] = useState(() => getBeirutWeekStart());
  const { data, loading, error, fetchData } = useFetch();

  const [subs, setSubs] = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);

  useEffect(() => {
    fetchData(`/schedule?week=${weekStart}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  // Fetch subs once on mount, then refresh after every successful booking so
  // the modal's Sessions Left preview and pickers always reflect current state.
  const refreshSubs = useCallback(async () => {
    setSubsLoading(true);
    try {
      const res = await apiFetch("/user-packages");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = await res.json();
      setSubs(Array.isArray(rows) ? rows : []);
    } catch {
      // Non-fatal — user just won't have subs to book against. The schedule
      // still renders and the "no active subscription" flow catches this.
      setSubs([]);
    } finally {
      setSubsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) refreshSubs();
  }, [user, refreshSubs]);

  const isSlotPast = useCallback(
    (slot) => {
      if (!slot) return false;
      const classDate = addDays(weekStart, slot.day_of_week);
      return classDate < getBeirutToday();
    },
    [weekStart]
  );

  // ── Interaction state ─────────────────────────────────────────────────────
  // Single state variable representing which modal is currently open on top of
  // the grid. Keeps the JSX tree flat and prevents overlap bugs (e.g. two
  // modals racing to close).
  //
  //   null                → nothing open
  //   { mode: "actions" } → SlotActionsModal
  //   { mode: "book" }    → BookingModal (client has eligible subs)
  //   { mode: "contact-missing" } → ContactStaffModal (no sub for this class)
  //   { mode: "contact-buy" }     → ContactStaffModal (client wants to buy)
  const [ui, setUi] = useState(null);

  const handleSlotClick = useCallback((slot) => {
    const classDate = addDays(weekStart, slot.day_of_week);
    setUi({ mode: "actions", slot, classDate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  const closeUi = useCallback(() => setUi(null), []);

  // Book flow — decides at click-time whether the client has any subscription
  // that covers this slot. Filter here (not on mount) so a booking made in
  // another tab / a sub added mid-session gets picked up on the next click.
  const handleChooseBook = useCallback(() => {
    if (!ui?.slot) return;
    const slot = ui.slot;
    const eligibleSubs = subs.filter(
      (s) =>
        s.class_type_id === slot.class_type_id &&
        Number(s.remaining_sessions) > 0 &&
        s.status !== "expired" &&
        s.status !== "depleted"
    );
    if (eligibleSubs.length === 0) {
      setUi({ mode: "contact-missing", slot, classDate: ui.classDate });
      return;
    }
    setUi({ mode: "book", slot, classDate: ui.classDate, eligibleSubs });
  }, [ui, subs]);

  const handleChooseBuy = useCallback(() => {
    if (!ui?.slot) return;
    setUi({ mode: "contact-buy", slot: ui.slot, classDate: ui.classDate });
  }, [ui]);

  const handleBookingSuccess = useCallback(async () => {
    setUi(null);
    // Refetch both — the slot's attending_count changes and the sub's
    // remaining_sessions decrements.
    await Promise.all([fetchData(`/schedule?week=${weekStart}`), refreshSubs()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart, refreshSubs]);

  const slots = data?.slots ?? [];

  const currentWeekStart = useMemo(() => getBeirutWeekStart(new Date()), []);
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
            Tap any class to book it with your subscription — or buy one on the spot.
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
          isSlotPast={isSlotPast}
          onSlotClick={handleSlotClick}
        />
      )}

      {/* Modal stack — only one is ever mounted at a time thanks to the
          single `ui` state variable. */}
      {ui?.mode === "actions" && (
        <SlotActionsModal
          slot={ui.slot}
          classDate={ui.classDate}
          onBook={handleChooseBook}
          onBuy={handleChooseBuy}
          onClose={closeUi}
        />
      )}
      {ui?.mode === "book" && (
        <BookingModal
          slot={ui.slot}
          classDate={ui.classDate}
          eligibleSubs={ui.eligibleSubs}
          onClose={closeUi}
          onBooked={handleBookingSuccess}
        />
      )}
      {(ui?.mode === "contact-missing" || ui?.mode === "contact-buy") && (
        <ContactStaffModal
          mode={ui.mode === "contact-missing" ? "missing-sub" : "buy"}
          slot={ui.slot}
          classDate={ui.classDate}
          onClose={closeUi}
        />
      )}
    </Container>
  );
};

export default WeeklySchedule;
