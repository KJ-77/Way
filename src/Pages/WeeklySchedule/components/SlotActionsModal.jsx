import { X, Ticket, ShoppingBag } from "@phosphor-icons/react";

const formatBookingDate = (yyyyMmDd) => {
  if (!yyyyMmDd) return "";
  return new Date(`${yyyyMmDd}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

const trimHhMm = (t) => (t || "").slice(0, 5);

// Small "what would you like to do?" picker that opens when a client clicks
// a slot in the weekly grid. Two paths — book against an existing sub, or
// message us to buy one. Whichever they pick, the parent decides which
// downstream modal to open (BookingModal or ContactStaffModal).
//
// Props:
//   slot        — the ScheduleSlotForWeek row (has class_type_name, times)
//   classDate   — "YYYY-MM-DD" for the specific occurrence
//   onBook      — client wants to book against their subscription
//   onBuy       — client wants to buy a new subscription (contact staff)
//   onClose     — dismissed without picking
const SlotActionsModal = ({ slot, classDate, onBook, onBuy, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <h2 className="text-lg font-medium text-[#5a4434] capitalize truncate">
              {slot.class_type_name || slot.package || "Class"}
            </h2>
            <p className="text-sm text-[#7a5d4d] mt-0.5">
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

        <p className="text-sm text-[#7a5d4d] mb-5">What would you like to do?</p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onBook}
            className="w-full inline-flex items-center gap-x-3 px-4 py-3 rounded-xl bg-[#5a4434] text-white text-sm font-medium hover:bg-[#4a372a] transition-colors"
          >
            <Ticket size={18} weight="bold" />
            <span className="flex-1 text-start">Book a class</span>
          </button>
          <button
            type="button"
            onClick={onBuy}
            className="w-full inline-flex items-center gap-x-3 px-4 py-3 rounded-xl border border-[#5a4434]/30 text-[#5a4434] text-sm font-medium hover:bg-[#5a4434]/5 transition-colors"
          >
            <ShoppingBag size={18} weight="bold" />
            <span className="flex-1 text-start">Buy subscription</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotActionsModal;
