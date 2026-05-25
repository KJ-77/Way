// Single class slot card. Two brown variants alternate by slot id for warmth
// and visual rhythm in the weekly grid (inspired by the studio's brand palette).
// Fully-booked slots get a muted, desaturated treatment so they read as "unavailable"
// at a glance while still showing the class details.
const VARIANTS = {
  dark: "bg-[#5a4434] text-white",
  light: "bg-[#a6826e] text-white",
  bookedDark: "bg-[#5a4434]/55 text-white/85",
  bookedLight: "bg-[#a6826e]/55 text-white/85",
};

const SlotCard = ({ slot, variantIndex = 0 }) => {
  // start_time / end_time come back as "HH:MM:SS" or "HH:MM" — slice to "HH:MM" for display
  const start = (slot.start_time || "").slice(0, 5);
  const end = (slot.end_time || "").slice(0, 5);
  const classType = slot.package || "Class";
  const isFullyBooked = !!slot.is_fully_booked;
  const isDark = variantIndex % 2 === 0;
  const variantClasses = isFullyBooked
    ? isDark ? VARIANTS.bookedDark : VARIANTS.bookedLight
    : isDark ? VARIANTS.dark : VARIANTS.light;

  return (
    <div
      className={`relative rounded-md px-5 py-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-y-2 ${variantClasses}`}
    >
      {/* Fully-booked badge — pinned top-right so it doesn't disturb the layout */}
      {isFullyBooked && (
        <span className="absolute top-2 right-2 text-[10px] uppercase tracking-widest font-semibold bg-white/15 px-2 py-0.5 rounded">
          Fully Booked
        </span>
      )}
      <p className="text-sm font-medium tabular-nums opacity-90">
        {start} – {end}
      </p>
      <h3 className="text-lg italic leading-tight font-medium capitalize">
        {classType}
      </h3>
      {slot.tutor_name && (
        <p className="text-xs italic opacity-80 mt-auto pt-2">
          with {slot.tutor_name}
        </p>
      )}
    </div>
  );
};

export default SlotCard;
