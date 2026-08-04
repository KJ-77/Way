import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Palette } from "@phosphor-icons/react";
import { apiFetch } from "../../../../../lib/api";
import TabEmptyState from "./TabEmptyState";

// Backend items handler force-filters GET /items to the caller's sub when
// source_pool === "client". No user_id param needed.
// See: Way-Backend src/functions/items/handler.ts → getItems()

// Stage palette. Labels are copied verbatim from the admin site's `items.stage_*`
// i18n keys (Way-Admin/src/i18n/locales/en.json) so a client and a studio manager
// looking at the same piece read the same words — "Ready for Pickup", not "Ready".
// Hues match the admin's stageBadgeVariant map; only the treatment differs
// (light fills here vs. the admin's dark-theme translucent fills).
//
// "picked up" was previously missing, which meant collected pieces silently fell
// through to the "Drying" fallback.
const STAGE_STYLES = {
  drying: {
    label: "Drying",
    classes: "bg-yellow-50 text-yellow-800 ring-yellow-200",
  },
  "bisque fired": {
    label: "Bisque Firing",
    classes: "bg-orange-50 text-orange-800 ring-orange-200",
  },
  "waiting glaze": {
    label: "In Progress",
    classes: "bg-blue-50 text-blue-800 ring-blue-200",
  },
  "glaze fired": {
    label: "Glaze Firing",
    classes: "bg-purple-50 text-purple-800 ring-purple-200",
  },
  ready: {
    label: "Ready for Pickup",
    classes: "bg-green-50 text-green-800 ring-green-200",
  },
  "picked up": {
    label: "Picked Up",
    classes: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  },
  discarded: {
    label: "Discarded",
    classes: "bg-red-50 text-red-700 ring-red-200",
  },
};

const StageBadge = ({ stage }) => {
  const style = STAGE_STYLES[stage] ?? STAGE_STYLES.drying;
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${style.classes}`}
    >
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

// Title falls back when an item has no description (the field is optional).
const itemTitle = (item) => item.description?.trim() || `Untitled piece #${item.id}`;

const ItemCard = ({ item }) => {
  return (
    <div className="bg-gray-50/60 rounded-xl p-4 sm:p-6">
      <div className="flex items-start justify-between gap-x-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {itemTitle(item)}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {item.section} · Started {formatDate(item.created_at)}
          </p>
        </div>
        <StageBadge stage={item.stage} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
        {item.clay_type && <Stat label="Clay Type" value={item.clay_type} />}
        {item.final_weight != null && (
          <Stat label="Final Weight" value={`${item.final_weight} kg`} />
        )}
        <Stat label="Last Updated" value={formatDate(item.updated_at)} />
      </div>
    </div>
  );
};

const MyWorkTab = () => {
  const [state, setState] = useState({
    status: "loading", // "loading" | "ready" | "error"
    data: [],
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await apiFetch("/items");
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
        Loading your work…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium text-red-600">
          Couldn't load your pieces.
        </p>
        <p className="mt-1 text-xs text-gray-500">{state.error}</p>
      </div>
    );
  }

  if (state.data.length === 0) {
    return (
      <TabEmptyState
        icon={Palette}
        title="No pieces yet"
        message="Your artwork in progress will appear here once you start creating at the studio."
        cta={
          <Link
            to="/schedule"
            className="mt-5 inline-flex items-center px-5 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            See this week's schedule
          </Link>
        }
      />
    );
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Your Work
      </h2>
      <div className="space-y-4">
        {state.data.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MyWorkTab;
