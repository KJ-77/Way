import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  XCircle,
} from "@phosphor-icons/react";
import { apiFetch } from "../../../../../lib/api";
import TabEmptyState from "./TabEmptyState";

// Backend sessions handler force-filters GET /sessions to the caller's sub
// when source_pool === "client", so we don't pass any user_id param here.
// See: Way-Backend src/functions/sessions/handler.ts → getSessions()
const ATTENDANCE_STYLES = {
  attended: {
    label: "Attended",
    Icon: CheckCircle,
    classes: "bg-green-50 text-green-700 ring-green-200",
  },
  booked: {
    label: "Upcoming",
    Icon: Clock,
    classes: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  cancelled: {
    label: "Cancelled",
    Icon: XCircle,
    classes: "bg-gray-100 text-gray-700 ring-gray-200",
  },
};

const AttendanceBadge = ({ attendance }) => {
  const style = ATTENDANCE_STYLES[attendance] ?? ATTENDANCE_STYLES.booked;
  const Icon = style.Icon;
  return (
    <span
      className={`inline-flex items-center gap-x-1 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${style.classes}`}
    >
      <Icon size={12} weight="fill" />
      {style.label}
    </span>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-900">{value}</p>
  </div>
);

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const SessionCard = ({ session }) => (
  <div className="bg-gray-50/60 rounded-xl p-4 sm:p-6">
    <div className="flex items-start justify-between gap-x-3 mb-4">
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-gray-900 truncate">
          {session.package_name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Session #{session.session_nb}
        </p>
      </div>
      <AttendanceBadge attendance={session.attendance} />
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
      <Stat label="Date" value={formatDate(session.created_at)} />
      {session.notes && (
        <div className="col-span-2 sm:col-span-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Notes</p>
          <p className="text-sm text-gray-700">{session.notes}</p>
        </div>
      )}
    </div>
  </div>
);

const BookingsTab = () => {
  const [state, setState] = useState({
    status: "loading", // "loading" | "ready" | "error"
    data: [],
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await apiFetch("/sessions");
        if (!res.ok) {
          throw new Error(`Request failed (HTTP ${res.status})`);
        }
        const data = await res.json();
        if (!cancelled) {
          setState({ status: "ready", data: Array.isArray(data) ? data : [], error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState({ status: "error", data: [], error: err.message || String(err) });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading bookings…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium text-red-600">
          Couldn't load your bookings.
        </p>
        <p className="mt-1 text-xs text-gray-500">{state.error}</p>
      </div>
    );
  }

  if (state.data.length === 0) {
    return (
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
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Your Bookings
      </h2>
      <div className="space-y-4">
        {state.data.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
};

export default BookingsTab;
