import { useEffect, useState } from "react";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Warning,
} from "@phosphor-icons/react";
import { apiFetch } from "../../../../../lib/api";
import TabEmptyState from "./TabEmptyState";

// Backend returns `status` computed at response time, mapped here to a label + pill style.
// See: Way-Backend src/functions/user-packages/handler.ts → computeStatus()
const STATUS_STYLES = {
  active: {
    label: "Active",
    Icon: CheckCircle,
    classes: "bg-green-50 text-green-700 ring-green-200",
  },
  expired: {
    label: "Expired",
    Icon: XCircle,
    classes: "bg-gray-100 text-gray-700 ring-gray-200",
  },
  depleted: {
    label: "Depleted",
    Icon: Warning,
    classes: "bg-amber-50 text-amber-800 ring-amber-200",
  },
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.expired;
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

// Small two-line label/value cell used inside each subscription card
const Stat = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-900">{value}</p>
  </div>
);

// formatDate("2026-09-01T00:00:00Z") → "Sep 1, 2026"
const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const SubscriptionCard = ({ sub }) => (
  <div className="bg-gray-50/60 rounded-xl p-4 sm:p-6">
    <div className="flex items-start justify-between gap-x-3 mb-4">
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-gray-900 truncate">
          {sub.package_name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Purchased {formatDate(sub.purchase_date)}
        </p>
      </div>
      <StatusBadge status={sub.status} />
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
      <Stat
        label="Sessions Left"
        value={`${sub.remaining_sessions} of ${sub.sessions_included}`}
      />
      {sub.weight_included > 0 && (
        <Stat
          label="Weight Remaining"
          value={`${sub.remaining_weight} kg of ${sub.weight_included}`}
        />
      )}
      <Stat label="Expires" value={formatDate(sub.expiry_date)} />
    </div>
    {/* `notes` is intentionally not rendered — it's an admin-facing field on the
        same /user-packages response. Hidden in the UI rather than stripped server-side
        so the admin dashboard keeps a single endpoint. */}
  </div>
);

// Fetches the logged-in user's subscriptions. The backend's customJwtAuthorizer
// recognizes client-pool tokens and auto-scopes GET /user-packages to the caller's
// own user_id, so we don't need to pass any query params here.
const SubscriptionsTab = () => {
  const [state, setState] = useState({
    status: "loading", // "loading" | "ready" | "error"
    data: [],
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await apiFetch("/user-packages");
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

    // Cancel late responses if the tab unmounts before the fetch resolves
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading subscriptions…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium text-red-600">
          Couldn't load your subscriptions.
        </p>
        <p className="mt-1 text-xs text-gray-500">{state.error}</p>
      </div>
    );
  }

  if (state.data.length === 0) {
    return (
      <TabEmptyState
        icon={CreditCard}
        title="No subscriptions yet"
        message="Your active plans and membership tiers will show up here once you're enrolled."
      />
    );
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Your Subscriptions
      </h2>
      <div className="space-y-4">
        {state.data.map((sub) => (
          <SubscriptionCard key={sub.id} sub={sub} />
        ))}
      </div>
    </section>
  );
};

export default SubscriptionsTab;
