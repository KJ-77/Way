import { useEffect } from "react";
import useFetch from "Hooks/useFetch";
import Container from "Components/Container/Container";
import { IsError, DotsLoader } from "Components/RequestHandler";
import PackagesGrid from "./components/PackagesGrid";

// Public packages catalog. Backed by GET /packages — anyone (logged in or not)
// can browse what Way offers; only logged-in users can (eventually) subscribe.
const Classes = () => {
  const { data, loading, error, fetchData } = useFetch();

  useEffect(() => {
    fetchData("/packages");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live backend returns a plain array; accept legacy mock-shaped { data: [...] } too.
  const packages = Array.isArray(data) ? data : data?.data ?? [];

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
          Pick a class package that fits your practice. Each subscription gives
          you a set number of sessions and a clay allowance to take home what
          you make.
        </p>
      </div>

      {/* Grid (or empty state) */}
      {packages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#5a4434]/15 py-16 text-center">
          <p className="text-[#5a4434]">No packages available right now.</p>
          <p className="text-sm text-[#a6826e] mt-1">Check back soon.</p>
        </div>
      ) : (
        <PackagesGrid packages={packages} />
      )}
    </Container>
  );
};

export default Classes;
