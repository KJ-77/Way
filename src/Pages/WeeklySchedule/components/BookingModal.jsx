import { useState, useMemo } from "react";
import { X } from "@phosphor-icons/react";
import { apiFetch } from "../../../lib/api";
import { friendlyError, throwIfNotOk } from "../../../lib/errors";

// Formats "2026-05-25" → "Monday, May 25, 2026" for the confirmation copy.
// Uses UTC because our date strings are calendar dates (no time-of-day) and
// we don't want DST/tz drift shifting them a day.
const formatBookingDate = (yyyyMmDd) => {
  if (!yyyyMmDd) return "";
  return new Date(`${yyyyMmDd}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

const trimHhMm = (t) => (t || "").slice(0, 5);

// Confirmation modal for booking a class occurrence. Pops when a client hits
// "Book" on an eligible slot in the weekly grid. Handles the sub picker when
// they have more than one eligible subscription for this class.
//
// Props:
//   slot          — the ScheduleSlotForWeek row (has class_type_id, class_type_name, times)
//   classDate     — "YYYY-MM-DD" for the specific occurrence being booked
//   eligibleSubs  — user_packages with matching class_type_id, remaining > 0, not expired
//   onClose       — user dismissed without booking
//   onBooked      — booking succeeded; parent should refetch the week
const BookingModal = ({ slot, classDate, eligibleSubs, onClose, onBooked }) => {
  // Default-select the sub with the fewest remaining sessions — use it up first
  // so it doesn't get stranded. Alphabetical tiebreak on package_name.
  const defaultSubId = useMemo(() => {
    if (!eligibleSubs?.length) return null;
    const sorted = [...eligibleSubs].sort((a, b) => {
      if (a.remaining_sessions !== b.remaining_sessions) {
        return a.remaining_sessions - b.remaining_sessions;
      }
      return (a.package_name || "").localeCompare(b.package_name || "");
    });
    return sorted[0].id;
  }, [eligibleSubs]);

  const [selectedSubId, setSelectedSubId] = useState(defaultSubId);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleConfirm = async () => {
    if (!selectedSubId) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await apiFetch("/sessions", {
        method: "POST",
        body: JSON.stringify({
          user_package_id: selectedSubId,
          schedule_slot_id: slot.id,
          class_date: classDate,
          attendance: "booked",
        }),
      });
      await throwIfNotOk(res, "Booking failed");
      onBooked?.();
    } catch (err) {
      setErrorMsg(friendlyError(err, "Couldn't book this class."));
    } finally {
      setSubmitting(false);
    }
  };

  const showPicker = eligibleSubs.length > 1;

  return (
    // Backdrop + centered card. Backdrop click closes.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8"
        // Stop clicks inside the card from bubbling to the backdrop handler.
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-medium text-[#5a4434] capitalize">
              Book {slot.class_type_name}
            </h2>
            <p className="text-sm text-[#7a5d4d] mt-1">
              {formatBookingDate(classDate)} · {trimHhMm(slot.start_time)}–{trimHhMm(slot.end_time)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#a6826e] hover:text-[#5a4434] transition-colors"
            aria-label="Close"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {showPicker && (
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-widest text-[#a6826e] mb-2">
              Use subscription
            </label>
            <div className="flex flex-col gap-2">
              {eligibleSubs.map((sub) => (
                <label
                  key={sub.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSubId === sub.id
                      ? "border-[#5a4434] bg-[#f3e7df]"
                      : "border-[#5a4434]/20 hover:border-[#5a4434]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="subscription"
                    value={sub.id}
                    checked={selectedSubId === sub.id}
                    onChange={() => setSelectedSubId(sub.id)}
                    className="accent-[#5a4434]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#5a4434] truncate capitalize">
                      {sub.package_name}
                    </div>
                    <div className="text-xs text-[#7a5d4d]">
                      {sub.remaining_sessions} session{sub.remaining_sessions === 1 ? "" : "s"} remaining
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {!showPicker && eligibleSubs[0] && (
          <div className="mb-5 p-3 rounded-lg bg-[#f3e7df]/60 border border-[#5a4434]/15">
            <div className="text-xs uppercase tracking-widest text-[#a6826e] mb-1">
              Using
            </div>
            <div className="text-sm font-medium text-[#5a4434] capitalize">
              {eligibleSubs[0].package_name}
            </div>
            <div className="text-xs text-[#7a5d4d] mt-0.5">
              {eligibleSubs[0].remaining_sessions} session
              {eligibleSubs[0].remaining_sessions === 1 ? "" : "s"} remaining before this booking
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
            {errorMsg}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#5a4434]/30 text-sm font-medium text-[#5a4434] hover:bg-[#5a4434]/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || !selectedSubId}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#5a4434] text-white text-sm font-medium hover:bg-[#4a372a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Booking…" : "Confirm booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
