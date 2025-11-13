import { useEffect } from "react";
import { Link } from "react-router-dom";
import useFetch from "Hooks/useFetch";
import { DotsLoader } from "Components/RequestHandler";
import Container from "Components/Container/Container";
import { ArrowRight, WhatsappLogo, InstagramLogo } from "@phosphor-icons/react";
import AboutUs from "./AboutUs";
import heroImage from "assests/hero-image.jpg";

const Home = () => {
  const { data, isLoading, fetchData } = useFetch();

  useEffect(() => {
    fetchData("/home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading)
    return (
      <div className="flex flex-col gap-4 min-h-[80vh] items-center justify-center ">
        <DotsLoader />
        <p className="text-xl font-bold">Loading...</p>
      </div>
    );

  return (
    <main className="relative">
      {/* Hero Video - Full Screen */}
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src={video}
          autoPlay
          muted
          loop
        /> */}

        <img
          src={heroImage}
          alt="hero"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />

        <div className="absolute right-10 bottom-20 z-[10000] text-white hidden lg:flex items-center gap-x-3">
          <a
            href="https://wa.me/919826000000"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappLogo size={24} />
          </a>
          <a
            href="https://www.instagram.com/your_instagram_handle"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramLogo size={24} />
          </a>
        </div>

        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-primary/20  z-10"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end mb-10 sm:mb-16 md:mb-20">
          <Container>
            <div className="flex flex-col text-white px-4 sm:px-0">
              {data?.data?.[0]?.title ? (
                <h1 className=" text-3xl sm:text-4xl md:text-7xl mb-2 w-full lg:w-1/2 ">
                  {(() => {
                    const title = data.data[0].title;
                    const words = title.split(" ");
                    if (words.length === 1) {
                      return <span className="title-outline">{title}</span>;
                    }
                    const lastWord = words[words.length - 1];
                    const restOfTitle = words.slice(0, -1).join(" ");
                    return (
                      <>
                        {restOfTitle}{" "}
                        <span className="title-outline text-5xl lg:text-8xl">
                          {lastWord}
                        </span>
                      </>
                    );
                  })()}
                </h1>
              ) : null}
              {data?.data?.[0]?.text ? (
                <p className="text-white w-full lg:w-1/2 text-sm mt-6 pr-20">
                  {data.data[0].text}
                </p>
              ) : null}
            </div>
            <div className="mt-4 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-y-3 sm:gap-y-0 gap-x-4 sm:gap-x-6 px-4 sm:px-0 lg:w-1/2">
              <Link
                to={"/auth/register"}
                className="w-full sm:w-auto px-3 text-sm py-1  rounded-lg border border-white flex items-center justify-center sm:justify-start gap-x-3 text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                Become a member
                <ArrowRight size={16} />
              </Link>
              <Link
                to={"/schedule"}
                className="w-full sm:w-auto px-5 text-sm py-1  rounded-lg border border-white flex items-center justify-center sm:justify-start gap-x-3 bg-white text-black hover:bg-transparent hover:text-white transition-all duration-300"
              >
                Book now
                {/* <ArrowRight size={16} /> */}
              </Link>
            </div>
          </Container>
        </div>
      </div>
      {/* Hero Section */}

      {/* Atelier Section */}
      <section className="py-secondary lg:py-primary bg-white">
        <Container>
          {/* Text Content */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl mb-6">
              An atelier that feels like{" "}
              <span className="text-secondary italic">Home</span>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-8 px-4">
              Here, every creation is an expression of your freedom shaping,
              molding, and exploring without limits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth/register"
                className="px-6 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                Become a member
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/schedule"
                className="px-6 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 flex items-center gap-2"
              >
                Book now
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Visual Grid - 3 Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-12 lg:mb-16">
            {/* Large Workshop Image - Full Width on Mobile, Spans 2 Cols on Desktop */}
            <div className="lg:col-span-2 rounded-2xl lg:rounded-[32px] overflow-hidden h-[300px] lg:h-[400px] bg-gray-200">
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                [Workshop Image - People around table doing activities]
              </div>
            </div>

            {/* Bottom Left - Coffeeshop Interior */}
            <div className="rounded-2xl lg:rounded-[32px] overflow-hidden h-[250px] lg:h-[300px] bg-gray-200">
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                [Coffeeshop Interior - 3D Render]
              </div>
            </div>

            {/* Bottom Right - Tutor Card with Illustration */}
            <div className="rounded-2xl lg:rounded-[32px] overflow-hidden h-[250px] lg:h-[300px] bg-secondary flex flex-col items-center justify-center text-white p-8">
              <div className="text-center">
                <div className="mb-4 text-6xl">
                  [Portrait Illustration]
                </div>
                <h3 className="text-xl font-semibold mb-1">MAYA DAHDOUH</h3>
                <p className="text-sm opacity-90">Painter and Assistant Ceramicist</p>
              </div>
            </div>
          </div>

          {/* Feature Cards - CoffeeBar and Tutors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* CoffeeBar Card */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl lg:text-3xl italic mb-4">Our CoffeeBar</h3>
              <p className="text-gray-700 mb-4">
                Located on Rue du Liban, Way offers a cozy and stylish space to
                freely create
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-primary">
                <button className="hover:opacity-70 transition-opacity">
                  <span className="text-2xl">←</span>
                </button>
                <button className="hover:opacity-70 transition-opacity">
                  <span className="text-2xl">→</span>
                </button>
              </div>
            </div>

            {/* Tutors Card */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl lg:text-3xl italic mb-4">Our Tutors</h3>
              <p className="text-gray-700 mb-4">
                Get to know the skilled tutors at Way, here to help you grow and
                refine your craft.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-primary">
                <button className="hover:opacity-70 transition-opacity">
                  <span className="text-2xl">←</span>
                </button>
                <button className="hover:opacity-70 transition-opacity">
                  <span className="text-2xl">→</span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Schedule Section */}
      <section className="py-secondary lg:py-primary bg-white">
        <Container>
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl mb-4">
              Our <span className="italic">Schedule</span>
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              Discover our schedule and join a session that inspires you
            </p>
            <Link
              to="/schedule"
              className="text-sm text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-2"
            >
              Book now
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Schedule Grid - 6 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Card 1: Handbuilding (The Explorer) */}
            <div className="flex flex-col">
              <div className="rounded-3xl overflow-hidden mb-4 h-[280px] bg-gray-200">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  [Handbuilding Image]
                </div>
              </div>
              <h3 className="text-xl mb-2">
                <span className="italic">Handbuilding</span> (The Explorer)
              </h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                <span>⏱</span>
                <span>2hrs</span>
              </div>
              <p className="text-gray-700 text-sm mb-4 flex-grow">
                A pottery technique where clay is molded by hand into unique
                shapes and textures.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  to="/schedule"
                  className="text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                  Download Schedule
                  <ArrowRight size={12} />
                </Link>
                <Link
                  to="/schedule"
                  className="text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                  Book now
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Card 2: Wheel Throwing (The Explorer) */}
            <div className="flex flex-col">
              <div className="rounded-3xl overflow-hidden mb-4 h-[280px] bg-gray-200">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  [Wheel Throwing Image]
                </div>
              </div>
              <h3 className="text-xl mb-2">
                <span className="italic">Wheel Throwing</span> (The Explorer)
              </h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                <span>⏱</span>
                <span>2hrs</span>
              </div>
              <p className="text-gray-700 text-sm mb-4 flex-grow">
                Wheel throwing is shaping clay on a spinning wheel to create
                smooth, symmetrical forms.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  to="/schedule"
                  className="text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                  Download Schedule
                  <ArrowRight size={12} />
                </Link>
                <Link
                  to="/schedule"
                  className="text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                  Book now
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Card 3: Sculpting (All levels) */}
            <div className="flex flex-col">
              <div className="rounded-3xl overflow-hidden mb-4 h-[280px] bg-gray-200">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  [Sculpting Image]
                </div>
              </div>
              <h3 className="text-xl mb-2">
                <span className="italic">Sculpting</span> (All levels)
              </h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                <span>⏱</span>
                <span>3hrs</span>
              </div>
              <p className="text-gray-700 text-sm mb-4 flex-grow">
                Sculpting is shaping and carving clay or other materials to
                create expressive, three-dimensional art
              </p>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  to="/schedule"
                  className="text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                  Download Schedule
                  <ArrowRight size={12} />
                </Link>
                <Link
                  to="/schedule"
                  className="text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                  Book now
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Card 4: Open Studio */}
            <div className="flex flex-col">
              <div className="rounded-3xl overflow-hidden mb-4 h-[280px] bg-gray-200">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  [Open Studio Image]
                </div>
              </div>
              <h3 className="text-xl mb-2">
                <span className="italic">Open Studio</span>
              </h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                <span>⏱</span>
                <span className="italic">Upon Enquiry</span>
              </div>
              <p className="text-gray-700 text-sm mb-4 flex-grow">
                Open Studio is a free-creation where you use our space, tools,
                and materials to work at your own pace.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  to="/schedule"
                  className="text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                  Download Schedule
                  <ArrowRight size={12} />
                </Link>
                <Link
                  to="/schedule"
                  className="text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                  Book now
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Card 5: Painting on Canvas */}
            <div className="flex flex-col">
              <div className="rounded-3xl overflow-hidden mb-4 h-[280px] bg-gray-200">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  [Painting on Canvas Image]
                </div>
              </div>
              <h3 className="text-xl mb-2">
                <span className="italic">Painting on Canvas</span>
              </h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                <span>⏱</span>
                <span>3hrs</span>
              </div>
              <p className="text-gray-700 text-sm mb-4 flex-grow">
                Painting on canvas is expressing ideas and emotions through
                color and texture on a blank surface
              </p>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  to="/schedule"
                  className="text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                  Download Schedule
                  <ArrowRight size={12} />
                </Link>
                <Link
                  to="/schedule"
                  className="text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                  Book now
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Card 6: Handbuilding (Mastery) */}
            <div className="flex flex-col">
              <div className="rounded-3xl overflow-hidden mb-4 h-[280px] bg-gray-200">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  [Handbuilding Mastery Image]
                </div>
              </div>
              <h3 className="text-xl mb-2">
                <span className="italic">Handbuilding</span> (Mastery)
              </h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                <span>⏱</span>
                <span>3hrs</span>
              </div>
              <p className="text-gray-700 text-sm mb-4 flex-grow">
                Handbuilding Advanced takes your skills further exploring
                complex forms, refined techniques, and more creative freedom in
                shaping clay.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  to="/schedule"
                  className="text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                  Download Schedule
                  <ArrowRight size={12} />
                </Link>
                <Link
                  to="/schedule"
                  className="text-primary underline hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                  Book now
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* View More Button */}
          <div className="text-center">
            <Link
              to="/schedule"
              className="inline-block px-8 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
            >
              View more
            </Link>
          </div>
        </Container>
      </section>

      {/* About Us Section */}
      {data?.aboutUs && <AboutUs aboutUsData={data.aboutUs} />}
    </main>
  );
};

export default Home;
