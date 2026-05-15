import { CalendarCheck } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import TabEmptyState from "./TabEmptyState";

const BookingsTab = () => (
  <TabEmptyState
    icon={CalendarCheck}
    title="No bookings yet"
    message="Your upcoming class registrations and past sessions will appear here."
    cta={
      <Link
        to="/classes"
        className="mt-5 inline-flex items-center px-5 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Browse classes
      </Link>
    }
  />
);

export default BookingsTab;
