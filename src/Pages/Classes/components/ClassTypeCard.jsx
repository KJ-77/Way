import { Link } from "react-router-dom";
import { ArrowRight, Stack } from "@phosphor-icons/react";

// Same two-tone brown alternation as PackageCard and the weekly schedule, so
// the catalog reads as one family of pages.
const VARIANTS = {
  dark: {
    card: "bg-[#5a4434] text-white",
    chip: "bg-white/10 text-white/95 border-white/15",
  },
  light: {
    card: "bg-[#a6826e] text-white",
    chip: "bg-white/15 text-white/95 border-white/20",
  },
};

// One class (e.g. "Hand Building Explorer") — the category, not an individual
// package. Tapping through lands on /classes/:id where every package that
// belongs to this class is listed.
const ClassTypeCard = ({ classType, packageCount = 0, variantIndex = 0 }) => {
  const v = variantIndex % 2 === 0 ? VARIANTS.dark : VARIANTS.light;

  return (
    <Link
      to={`/classes/${classType.id}`}
      className={`group relative flex flex-col rounded-2xl p-6 sm:p-8 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${v.card}`}
    >
      <h3 className="text-2xl sm:text-3xl font-light italic leading-tight capitalize">
        {classType.name}
      </h3>

      {classType.description && (
        <p className="mt-3 text-sm leading-relaxed opacity-85">
          {classType.description}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-x-4">
        {packageCount > 0 ? (
          <span
            className={`inline-flex items-center gap-x-2 rounded-full border px-3 py-1.5 text-xs font-medium ${v.chip}`}
          >
            <Stack size={14} weight="bold" />
            {packageCount} package{packageCount === 1 ? "" : "s"}
          </span>
        ) : (
          <span className="text-xs uppercase tracking-wider opacity-70">
            View details
          </span>
        )}

        <ArrowRight
          size={20}
          weight="bold"
          className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
};

export default ClassTypeCard;
