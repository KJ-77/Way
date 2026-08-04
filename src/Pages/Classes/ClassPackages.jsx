import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import useFetch from "Hooks/useFetch";
import Container from "Components/Container/Container";
import { IsError, DotsLoader } from "Components/RequestHandler";
import PackagesGrid from "./components/PackagesGrid";
import PriceNote from "./components/PriceNote";

// Drill-down from /classes — every package belonging to one class type.
//
// GET /packages has no server-side class_type_id filter, so we fetch the full
// list and narrow it here. The list is small (a handful of rows) and it's the
// same request /classes already makes, so it comes back warm from the browser
// cache. Add `?class_type_id=` to the backend if the catalog ever grows enough
// to make that wasteful.
const ClassPackages = () => {
  const { classTypeId } = useParams();
  const { data: packageData, loading, error, fetchData } = useFetch();
  const { data: classTypeData, fetchData: fetchClassType } = useFetch();

  useEffect(() => {
    fetchData("/packages");
    fetchClassType(`/class-types/${classTypeId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classTypeId]);

  const packages = Array.isArray(packageData)
    ? packageData
    : packageData?.data ?? [];

  const classPackages = useMemo(
    () => packages.filter((pkg) => String(pkg.class_type_id) === String(classTypeId)),
    [packages, classTypeId]
  );

  // Prefer the class-type record for the heading, but fall back to the joined
  // class_type_name on any matched package if that request hasn't landed (or
  // failed) — the name is present on both shapes.
  const className =
    classTypeData?.name ?? classPackages[0]?.class_type_name ?? "Class";
  const classDescription = classTypeData?.description;

  if (loading) {
    return (
      <div className="flex flex-col gap-4 min-h-[60vh] items-center justify-center">
        <DotsLoader />
        <p className="text-xl font-bold">Loading packages…</p>
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
      {/* Back link + heading */}
      <div className="mb-10 lg:mb-secondary">
        <Link
          to="/classes"
          className="inline-flex items-center gap-x-2 text-sm text-[#a6826e] hover:text-[#5a4434] transition-colors duration-200"
        >
          <ArrowLeft size={16} weight="bold" />
          All classes
        </Link>

        <div className="mt-5 flex flex-col gap-4 lg:gap-6 max-w-2xl">
          <h1 className="text-3xl lg:text-5xl font-light text-[#5a4434] capitalize">
            <span className="italic">{className}</span>
          </h1>
          <p className="text-lg lg:text-xl text-[#7a5d4d]">
            {classDescription ||
              "Pick the package that fits your practice. Each one gives you a set number of sessions and a clay allowance to take home what you make."}
          </p>
        </div>
      </div>

      {/* Grid (or empty state) */}
      {classPackages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#5a4434]/15 py-16 text-center">
          <p className="text-[#5a4434]">
            No packages available for this class right now.
          </p>
          <p className="text-sm text-[#a6826e] mt-1">Check back soon.</p>
        </div>
      ) : (
        <>
          <PackagesGrid packages={classPackages} />
          <PriceNote />
        </>
      )}
    </Container>
  );
};

export default ClassPackages;
