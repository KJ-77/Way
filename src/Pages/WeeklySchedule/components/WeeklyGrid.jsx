import { useMemo } from "react";
import DayColumn from "./DayColumn";

// Days of week — index matches the backend's day_of_week (0 = Monday … 6 = Sunday).
const DAYS = [
  { idx: 0, label: "Monday" },
  { idx: 1, label: "Tuesday" },
  { idx: 2, label: "Wednesday" },
  { idx: 3, label: "Thursday" },
  { idx: 4, label: "Friday" },
  { idx: 5, label: "Saturday" },
  { idx: 6, label: "Sunday" },
];

// Groups the flat slot array into 7 buckets keyed by day_of_week. Sorted by
// start_time within each day so the column reads top→bottom in time order.
const groupByDay = (slots) => {
  const buckets = Array.from({ length: 7 }, () => []);
  for (const slot of slots) {
    if (typeof slot.day_of_week === "number" && slot.day_of_week >= 0 && slot.day_of_week <= 6) {
      buckets[slot.day_of_week].push(slot);
    }
  }
  for (const bucket of buckets) {
    bucket.sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
  }
  return buckets;
};

// Renders the seven day columns. Responsive: 1 col on mobile, 2 on tablet, 7 on desktop.
// isSlotBookable(slot) is passed down from the page — the grid stays dumb.
const WeeklyGrid = ({ slots, isSlotBookable, onBookSlot }) => {
  const slotsByDay = useMemo(() => groupByDay(slots), [slots]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 sm:gap-5">
      {DAYS.map((day) => (
        <DayColumn
          key={day.idx}
          dayLabel={day.label}
          slots={slotsByDay[day.idx]}
          startVariant={day.idx}
          isSlotBookable={isSlotBookable}
          onBookSlot={onBookSlot}
        />
      ))}
    </div>
  );
};

export default WeeklyGrid;
