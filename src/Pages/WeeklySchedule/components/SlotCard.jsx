import { Prohibit, Ticket } from "@phosphor-icons/react";

// Single class slot card. Two brown variants alternate by slot id for warmth
// and visual rhythm in the weekly grid (inspired by the studio's brand palette).
//
// Visual states (cascade — strongest wins):
//   1. Cancelled (per-week override)  → fully greyed-out, line-through, "Cancelled"
//      badge + a hover tooltip with the reason when one was provided.
//   2. Fully booked (per-week override) → desaturated muted variant + badge.
//   3. Normal → dark/light brown alternating variant.
//
// Booking CTA: when the parent passes `canBook=true` (client has an eligible
// subscription for this class AND the occurrence is in the future AND the slot
// isn't cancelled/fully-booked), we render an inline "Book" button that opens
// the BookingModal via the onBook callback.
const VARIANTS = {
  dark: "bg-[#5a4434] text-white",
  light: "bg-[#a6826e] text-white",
  bookedDark: "bg-[#5a4434]/55 text-white/85",
  bookedLight: "bg-[#a6826e]/55 text-white/85",
  cancelled: "bg-gray-200 text-gray-500 border border-gray-300",
};

const SlotCard = ({ slot, variantIndex = 0, canBook = false, onBook }) => {
  const start = (slot.start_time || "").slice(0, 5);
  const end = (slot.end_time || "").slice(0, 5);
  // class_type_name is the joined class name from the backend; fall back to
  // the legacy `package` field only if the backend hasn't been redeployed yet.
  const classType = slot.class_type_name || slot.package || "Class";
  const isCancelled = !!slot.is_cancelled;
  const isFullyBooked = !!slot.is_fully_booked;
  const isDark = variantIndex % 2 === 0;

  // Pick the appropriate variant — cancelled trumps fully-booked trumps normal.
  let variantClasses;
  if (isCancelled) {
    variantClasses = VARIANTS.cancelled;
  } else if (isFullyBooked) {
    variantClasses = isDark ? VARIANTS.bookedDark : VARIANTS.bookedLight;
  } else {
    variantClasses = isDark ? VARIANTS.dark : VARIANTS.light;
  }

  return (
    // `group` enables the tooltip-on-hover (sibling element opens when the
    // parent is hovered). Tailwind native — no JS state needed.
    <div
      className={`group relative rounded-md px-5 py-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-y-2 ${variantClasses}`}
    >
      {/* Cancelled badge — replaces fully-booked badge when both would apply */}
      {isCancelled && (
        <span className="absolute top-2 right-2 text-[10px] uppercase tracking-widest font-semibold bg-gray-300 text-gray-700 px-2 py-0.5 rounded inline-flex items-center gap-1">
          <Prohibit size={10} weight="bold" /> Cancelled
        </span>
      )}
      {!isCancelled && isFullyBooked && (
        <span className="absolute top-2 right-2 text-[10px] uppercase tracking-widest font-semibold bg-white/15 px-2 py-0.5 rounded">
          Fully Booked
        </span>
      )}

      <p
        className={`text-sm font-medium tabular-nums ${
          isCancelled ? "line-through opacity-70" : "opacity-90"
        }`}
      >
        {start} – {end}
      </p>
      <h3
        className={`text-lg italic leading-tight font-medium capitalize ${
          isCancelled ? "line-through opacity-70" : ""
        }`}
      >
        {classType}
      </h3>
      {slot.tutor_name && (
        <p
          className={`text-xs italic mt-auto pt-2 ${
            isCancelled ? "line-through opacity-60" : "opacity-80"
          }`}
        >
          with {slot.tutor_name}
        </p>
      )}

      {/* Book CTA — only rendered when the parent flags this occurrence as
          eligible for the current user. Sits at the bottom of the card so
          the tutor line + card body stay above it. */}
      {canBook && (
        <button
          type="button"
          onClick={() => onBook?.(slot)}
          className="mt-3 inline-flex items-center justify-center gap-x-1.5 w-full px-3 py-1.5 rounded-md bg-white/95 text-[#5a4434] text-xs font-medium hover:bg-white transition-colors"
        >
          <Ticket size={14} weight="bold" />
          Book
        </button>
      )}

      {/* Tooltip — only renders for cancelled slots with a reason.
          CSS-only: hidden by default, fades in on group hover/focus.
          Pointer-events-none so it doesn't intercept clicks. */}
      {isCancelled && slot.cancel_reason && (
        <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20 w-56">
          <div className="rounded-md bg-[#5a4434] text-white text-xs px-3 py-2 shadow-lg">
            <p className="font-semibold uppercase tracking-wider text-[10px] mb-1">
              Cancelled
            </p>
            <p className="leading-snug normal-case">{slot.cancel_reason}</p>
            {/* Little arrow pointing down to the card */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full h-2 w-2 rotate-45 bg-[#5a4434]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotCard;
