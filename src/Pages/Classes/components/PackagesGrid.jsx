import PackageCard from "./PackageCard";

// Responsive package grid. Sorts by id so the brown-light alternation is stable
// across renders. Pass `variantIndex` per card so adjacent cards aren't the same shade.
const PackagesGrid = ({ packages }) => {
  const sorted = [...packages].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {sorted.map((pkg, idx) => (
        <PackageCard key={pkg.id} pkg={pkg} variantIndex={idx} />
      ))}
    </div>
  );
};

export default PackagesGrid;
