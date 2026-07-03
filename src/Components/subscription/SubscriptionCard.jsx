import { CheckCircle, XCircle, Warning, ArrowRight } from "@phosphor-icons/react";

// Card that shows one subscription — used both on the Account → Subscriptions
// tab and inside the booking modal. Passing `preview` renders a "before → after"
// delta next to the field being changed by the pending action:
//
//   <SubscriptionCard sub={sub} preview={{ sessionsDelta: -1 }} />
//
// currently only sessionsDelta is supported — extend the shape if we ever
// preview weight or expiry changes too.

// Backend `status` comes from computeStatus() in user-packages/handler.ts.
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

// Two-line label/value cell. Accepts an optional `delta` node rendered inline
// with the value — used to draw "8 → 7" transitions on preview.
const Stat = ({ label, value, delta }) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-900 inline-flex items-center gap-x-1.5">
      {value}
      {delta}
    </p>
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

const SubscriptionCard = ({ sub, preview }) => {
  const sessionsDelta = preview?.sessionsDelta ?? 0;
  const nextSessions = Number(sub.remaining_sessions) + sessionsDelta;

  // Only show the arrow-preview when the delta is non-zero AND the resulting
  // number is non-negative (defensive — the backend enforces this too).
  const sessionsDeltaNode =
    sessionsDelta !== 0 && nextSessions >= 0 ? (
      <span className="inline-flex items-center gap-x-1 text-[#5a4434] font-semibold">
        <ArrowRight size={12} weight="bold" />
        <span className="tabular-nums">{nextSessions}</span>
      </span>
    ) : null;

  return (
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
          value={
            <span className="tabular-nums">
              {sub.remaining_sessions} of {sub.sessions_included}
            </span>
          }
          delta={sessionsDeltaNode}
        />
        {sub.weight_included > 0 && (
          <Stat
            label="Weight Remaining"
            value={`${sub.remaining_weight} kg of ${sub.weight_included}`}
          />
        )}
        <Stat label="Expires" value={formatDate(sub.expiry_date)} />
      </div>
    </div>
  );
};

export default SubscriptionCard;
