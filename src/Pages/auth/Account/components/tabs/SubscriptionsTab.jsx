import { useEffect, useState } from "react";
import { CreditCard } from "@phosphor-icons/react";
import { apiFetch } from "../../../../../lib/api";
import SubscriptionCard from "../../../../../Components/subscription/SubscriptionCard";
import TabEmptyState from "./TabEmptyState";

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
