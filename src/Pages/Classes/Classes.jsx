import { useEffect, useMemo } from "react";
import useFetch from "Hooks/useFetch";
import Container from "Components/Container/Container";
import { IsError, DotsLoader } from "Components/RequestHandler";
import ClassTypesGrid from "./components/ClassTypesGrid";

// Class catalog, one level up from packages. Backed by GET /class-types — the
// same list the admin site manages — so a client sees "Hand Building Explorer"
// once instead of every 4-session / 8-session variant of it. Picking a class
// drills into /classes/:id, which is where the individual packages live.
//
// Packages are fetched alongside purely to show a count per class; a failure
// there degrades to "no count" rather than breaking the page.
const Classes = () => {
  const { data: classTypeData, loading, error, fetchData } = useFetch();
  const { data: packageData, fetchData: fetchPackages } = useFetch();

  useEffect(() => {
    fetchData("/class-types");
    fetchPackages("/packages");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live backend returns a plain array; accept legacy mock-shaped { data: [...] } too.
  const classTypes = Array.isArray(classTypeData)
    ? classTypeData
    : classTypeData?.data ?? [];
  const packages = Array.isArray(packageData)
    ? packageData
    : packageData?.data ?? [];

  // Retired classes (is_active=false) stay in the DB for referential integrity
  // but shouldn't be sold, so they're filtered out of the public catalog.
  const activeClassTypes = useMemo(
    () => classTypes.filter((ct) => ct.is_active !== false),
    [classTypes]
  );

  const packageCounts = useMemo(() => {
    return packages.reduce((acc, pkg) => {
      if (pkg.class_type_id == null) return acc;
      acc[pkg.class_type_id] = (acc[pkg.class_type_id] ?? 0) + 1;
      return acc;
    }, {});
  }, [packages]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 min-h-[60vh] items-center justify-center">
        <DotsLoader />
        <p className="text-xl font-bold">Loading classes…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <IsError message={error.message} />
      </div>
    );
  }

  return (
    <Container className="my-6 sm:my-secondary md:my-primary lg:my-large">
      {/* Heading */}
      <div className="flex flex-col gap-4 lg:gap-6 mb-10 lg:mb-secondary max-w-2xl">
        <h1 className="text-3xl lg:text-5xl font-light text-[#5a4434]">
          Our <span className="italic">Classes</span>
        </h1>
        <p className="text-lg lg:text-xl text-[#7a5d4d]">
          Choose the class you'd like to practice, then pick the package that
          fits — each one gives you a set number of sessions and a clay allowance
          to take home what you make.
        </p>
      </div>

      {/* Grid (or empty state) */}
      {activeClassTypes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#5a4434]/15 py-16 text-center">
          <p className="text-[#5a4434]">No classes available right now.</p>
          <p className="text-sm text-[#a6826e] mt-1">Check back soon.</p>
        </div>
      ) : (
        <ClassTypesGrid
          classTypes={activeClassTypes}
          packageCounts={packageCounts}
        />
      )}
    </Container>
  );
};

export default Classes;
