import { CheckCircle, XCircle, Warning, ArrowRight, Calendar, Scales } from "@phosphor-icons/react";

// Card that shows one subscription — used both on the Account → Subscriptions
// tab and inside the booking modal. Passing `preview` renders a "before → after"
// delta next to the field being changed by the pending action:
//
//   <SubscriptionCard sub={sub} preview={{ sessionsDelta: -1 }} />
//
// currently only sessionsDelta is supported — extend the shape if we ever
// preview weight or expiry changes too.
//
// `highlight` switches the two balance figures (sessions left, weight remaining)
// from small label/value pairs to large metric tiles with consumption bars. The
// account page turns it on — those numbers are the reason people open that tab.
// The booking modal leaves it off so the card stays compact inside the dialog.

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

// Big balance tile: remaining figure at display size, the total as context, and
// a bar showing how much of the package is left. Turns amber once a quarter or
// less remains so a nearly-spent package is obvious at a glance.
const BalanceTile = ({ icon: Icon, label, remaining, total, unit, delta }) => {
  const remainingNum = Number(remaining) || 0;
  const totalNum = Number(total) || 0;
  // Guard the divide — a package with no total would otherwise produce NaN.
  const pct = totalNum > 0 ? Math.min(100, Math.max(0, (remainingNum / totalNum) * 100)) : 0;
  const isLow = pct <= 25;

  return (
    <div
      className={`rounded-xl border p-4 ${
        isLow ? "border-amber-200 bg-amber-50/60" : "border-[#5a4434]/15 bg-[#5a4434]/[0.04]"
      }`}
    >
      <p className="flex items-center gap-x-1.5 text-xs uppercase tracking-wider text-[#7a5d4d] mb-2">
        <Icon size={14} weight="bold" />
        {label}
      </p>

      <p className="flex items-baseline gap-x-1.5">
        <span
          className={`text-3xl sm:text-4xl font-semibold tabular-nums leading-none ${
            isLow ? "text-amber-700" : "text-[#5a4434]"
          }`}
        >
          {remaining}
        </span>
        {unit && (
          <span className="text-sm font-medium text-[#7a5d4d]">{unit}</span>
        )}
        {/* `total` must stay numeric — the bar percentage divides by it. The
            unit is appended here for display only. */}
        <span className="text-sm text-gray-500">
          of {total}
          {unit ? ` ${unit}` : ""}
        </span>
        {delta}
      </p>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#5a4434]/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isLow ? "bg-amber-500" : "bg-[#a6826e]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const SubscriptionCard = ({ sub, preview, highlight = false }) => {
  const sessionsDelta = preview?.sessionsDelta ?? 0;
  const nextSessions = Number(sub.remaining_sessions) + sessionsDelta;
  const hasWeight = Number(sub.weight_included) > 0;

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

      {highlight ? (
        <>
          <div
            className={`grid gap-3 ${hasWeight ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
          >
            <BalanceTile
              icon={Calendar}
              label="Sessions Left"
              remaining={sub.remaining_sessions}
              total={sub.sessions_included}
              delta={sessionsDeltaNode}
            />
            {hasWeight && (
              <BalanceTile
                icon={Scales}
                label="Weight Remaining"
                remaining={sub.remaining_weight}
                total={sub.weight_included}
                unit="kg"
              />
            )}
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Expires{" "}
            <span className="font-medium text-gray-700">
              {formatDate(sub.expiry_date)}
            </span>
          </p>
        </>
      ) : (
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
          {hasWeight && (
            <Stat
              label="Weight Remaining"
              value={`${sub.remaining_weight} kg of ${sub.weight_included}`}
            />
          )}
          <Stat label="Expires" value={formatDate(sub.expiry_date)} />
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;
