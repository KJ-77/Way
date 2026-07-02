import SlotCard from "./SlotCard";

// One vertical day column: day-name header + stacked slot cards.
// Empty days get a soft "No classes" placeholder so the column keeps its weight.
// `startVariant` lets the parent stagger the dark/light pattern across columns so
// adjacent cells in the desktop grid don't all share the same shade.
// isSlotBookable(slot) is the parent's eligibility predicate — the column
// forwards each slot into it, and only shows the Book CTA when it returns true.
const DayColumn = ({ dayLabel, slots, startVariant = 0, isSlotBookable, onBookSlot }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="text-center pb-3 mb-4 border-b border-[#5a4434]/20">
        <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-[#5a4434]">
          {dayLabel}
        </h2>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        {slots.length === 0 ? (
          <div className="text-center text-xs text-[#a6826e] italic py-6">
            No classes
          </div>
        ) : (
          slots.map((slot, idx) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              variantIndex={startVariant + idx}
              canBook={isSlotBookable ? isSlotBookable(slot) : false}
              onBook={onBookSlot}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DayColumn;
