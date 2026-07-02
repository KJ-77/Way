import { Calendar, Sparkle } from "@phosphor-icons/react";

// Two brown variants alternate by id to give the catalog visual rhythm — same
// palette as the weekly schedule page so the two pages feel cohesive.
const VARIANTS = {
  dark: {
    card: "bg-[#5a4434] text-white",
    chip: "bg-white/10 text-white/95 border-white/15",
    cta: "bg-white text-[#5a4434] hover:bg-[#f3e7df]",
    secondary: "border border-white/30 text-white hover:bg-white/10",
  },
  light: {
    card: "bg-[#a6826e] text-white",
    chip: "bg-white/15 text-white/95 border-white/20",
    cta: "bg-white text-[#5a4434] hover:bg-[#f3e7df]",
    secondary: "border border-white/40 text-white hover:bg-white/10",
  },
};

// Tiny pill that summarizes one "included" perk (sessions / weight).
const Perk = ({ icon: Icon, label, chip }) => (
  <div className={`inline-flex items-center gap-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${chip}`}>
    <Icon size={14} weight="bold" />
    {label}
  </div>
);

// /classes is now behind <ProtectedRoute>, so every viewer of this card is
// logged in. The old "Sign in to subscribe" branch is gone; the CTA is a
// disabled "Coming soon" placeholder until the subscribe purchase flow lands.
const PackageCard = ({ pkg, variantIndex = 0 }) => {
  const v = variantIndex % 2 === 0 ? VARIANTS.dark : VARIANTS.light;

  // Build the perk pills from whatever fields the package actually has set.
  // Weight allowance is intentionally hidden from the public catalog — clients
  // only see sessions count. Studio still tracks weight internally.
  const perks = [];
  if (pkg.sessions_included && Number(pkg.sessions_included) > 0) {
    perks.push({
      icon: Calendar,
      label: `${pkg.sessions_included} session${pkg.sessions_included === 1 ? "" : "s"}`,
    });
  }

  const priceLabel =
    pkg.price != null && Number(pkg.price) > 0 ? `$${Number(pkg.price).toLocaleString()}` : "—";

  return (
    <article
      className={`relative flex flex-col rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8 ${v.card}`}
    >
      {/* Title + optional notes */}
      <header className="mb-5">
        <h3 className="text-2xl sm:text-3xl font-light italic leading-tight capitalize">
          {pkg.package_type || "Package"}
        </h3>
        {pkg.notes && (
          <p className="text-sm italic opacity-85 mt-2 leading-relaxed">{pkg.notes}</p>
        )}
      </header>

      {/* Perks */}
      {perks.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-6">
          {perks.map((perk) => (
            <li key={perk.label}>
              <Perk icon={perk.icon} label={perk.label} chip={v.chip} />
            </li>
          ))}
        </ul>
      )}

      {/* Price block (pushed to bottom) */}
      <div className="mt-auto">
        <div className="flex items-baseline gap-x-2 mb-5">
          <span className="text-4xl font-light tabular-nums">{priceLabel}</span>
          <span className="text-xs uppercase tracking-wider opacity-70">per package</span>
        </div>

        {/* CTA — disabled placeholder until the subscribe purchase flow lands. */}
        <button
          type="button"
          disabled
          className={`w-full flex items-center justify-center gap-x-2 px-5 py-3 rounded-xl text-sm font-medium cursor-not-allowed opacity-70 ${v.secondary}`}
          title="Subscribe flow coming soon"
        >
          <Sparkle size={16} weight="bold" />
          Subscribe — coming soon
        </button>
      </div>
    </article>
  );
};

export default PackageCard;
