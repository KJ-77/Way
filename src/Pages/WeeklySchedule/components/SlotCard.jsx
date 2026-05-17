// Single class slot card. Two brown variants alternate by slot id for warmth
// and visual rhythm in the weekly grid (inspired by the studio's brand palette).
const VARIANTS = {
  dark: "bg-[#5a4434] text-white",
  light: "bg-[#a6826e] text-white",
};

const SlotCard = ({ slot, variantIndex = 0 }) => {
  // start_time / end_time come back as "HH:MM:SS" or "HH:MM" — slice to "HH:MM" for display
  const start = (slot.start_time || "").slice(0, 5);
  const end = (slot.end_time || "").slice(0, 5);
  const classType = slot.package || "Class";
  const variantClasses = variantIndex % 2 === 0 ? VARIANTS.dark : VARIANTS.light;

  return (
    <div
      className={`rounded-md px-5 py-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-y-2 ${variantClasses}`}
    >
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
