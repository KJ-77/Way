import { useContext, useEffect, useRef } from "react";
import useFetch from "Hooks/useFetch";
import { DotsLoader } from "Components/RequestHandler";
import Container from "Components/Container/Container";
import Button from "Components/form/Button";
import AuthContext from "Context/AuthContext";
import { buildWhatsAppUrl } from "Utilities/contact";
import { WAY_INSTAGRAM_URL } from "Utilities/socials";
import {
  ArrowRight,
  WhatsappLogo,
  InstagramLogo,
  Clock,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import AboutUs from "./AboutUs";
import heroSlide2 from "assets/images/landing/hero-2.webp";
import heroSlide3 from "assets/images/landing/hero-3.webp";
import heroSlide4 from "assets/images/landing/hero-4.webp";
import wheelthrowingImage from "assets/images/home/wheelthrowing.webp";
import readyMadeImage from "assets/images/home/ready-made.webp";
import handbuildingImage from "assets/images/home/handbuilding.webp";
import handbuildingMasteryImage from "assets/images/home/handbuilding-mastery.webp";
import workshopImage from "assets/images/home/workshop-image.webp";
import studioImage from "assets/images/home/studio-picture.webp";
import ourProductsImage from "assets/images/home/bento-2.webp";
import tutorsImage from "assets/images/home/bento-3.webp";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Hero background slideshow images (auto-rotating carousel that replaces the
// single static hero image).
const HERO_SLIDES = [heroSlide2, heroSlide3, heroSlide4];

const Home = () => {
  const { data, isLoading, fetchData } = useFetch();
  const { isLoggedIn } = useContext(AuthContext);
  const classesPrevRef = useRef(null);
  const classesNextRef = useRef(null);

  // Single hero CTA, chosen by auth state: members go straight to booking,
  // everyone else is pushed to sign up. Never both at once.
  const heroCta = isLoggedIn
    ? { label: "Book now", to: "/schedule" }
    : { label: "Become a member", to: "/auth/register" };

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
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Auto-rotating hero background carousel (fades between landing photos) */}
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          allowTouchMove={false}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="hero-swiper absolute inset-0 w-full h-full z-0"
        >
          {HERO_SLIDES.map((slide, index) => (
            <SwiperSlide key={index}>
              <img src={slide} alt="" className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute right-10 bottom-20 z-[10000] text-white hidden lg:flex items-center gap-x-3">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <WhatsappLogo size={24} />
          </a>
          <a
            href={WAY_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <InstagramLogo size={24} />
          </a>
        </div>

        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-primary/20 z-10"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end mb-10 sm:mb-16 md:mb-20">
          <Container>
            <div className="flex flex-col text-white px-4 sm:px-0">
              {data?.data?.[0]?.title ? (
                <h1 className="title text-3xl sm:text-4xl md:text-7xl mb-2 w-full lg:w-1/2">
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
            <div className="mt-4 sm:mt-14 flex items-center justify-center px-4 sm:px-0 lg:w-1/2">
              <Button
                to={heroCta.to}
                variant="outline-white"
                size="sm"
                className="w-full sm:w-auto"
              >
                {heroCta.label}
                <ArrowRight size={16} />
              </Button>
            </div>
          </Container>
        </div>
      </div>

      {/* Atelier Section */}
      <section className="py-secondary lg:pt-primary lg:pb-20 bg-white">
        <Container>
          {/* Text Content */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl mb-6">
              An atelier that feels like{" "}
              <span className="text-secondary italic">Home</span>
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto px-4">
              Here, every creation is an expression of your freedom shaping,
              molding, and exploring without limits.
            </p>
          </div>

          {/* Visual Grid — images only. The "Our Products" / "Our Tutors"
              headings and blurbs that used to sit above each tile (mobile) and
              in a row underneath (desktop) were removed; the bento is now purely
              photographic at every breakpoint. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Large Workshop Image */}
            <div className="lg:col-span-2 rounded-2xl lg:rounded-[32px] overflow-hidden h-[300px] lg:h-[460px] bg-gray-200">
              <img
                src={workshopImage}
                alt="Workshop"
                className="w-full h-full object-cover object-[50%_30%]"
              />
            </div>

            {/* Bottom Left - Products */}
            <div className="rounded-2xl lg:rounded-[32px] overflow-hidden h-[250px] lg:h-[300px] bg-gray-200">
              <img
                src={ourProductsImage}
                alt="Products"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Bottom Right - Tutors */}
            <div className="rounded-2xl lg:rounded-[32px] overflow-hidden h-[250px] lg:h-[300px] bg-gray-200">
              <img
                src={tutorsImage}
                alt="Two students laughing together while shaping clay at the studio worktable"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Our Classes Section */}
      <section className="py-secondary lg:py-20 bg-white">
        <Container>
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl mb-4">
              Our <span className="italic">Classes</span>
            </h2>
            <p className="text-gray-700 text-lg">
              Discover our classes and join a session that inspires you
            </p>
          </div>

          {/* Classes Carousel */}
          <div className="relative group mb-12">
            <style jsx="true">{`
              .home-classes-swiper .swiper-pagination-bullet {
                background: #421f19;
                opacity: 0.3;
              }
              .home-classes-swiper .swiper-pagination-bullet-active {
                background: #421f19;
                opacity: 1;
              }
            `}</style>
            <Swiper
              spaceBetween={32}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              pagination={{ dynamicBullets: true }}
              navigation={{
                prevEl: classesPrevRef.current,
                nextEl: classesNextRef.current,
              }}
              onBeforeInit={(swiper) => {
                if (swiper.params.navigation) {
                  swiper.params.navigation.prevEl = classesPrevRef.current;
                  swiper.params.navigation.nextEl = classesNextRef.current;
                }
              }}
              modules={[Pagination, Navigation]}
              className="home-classes-swiper px-1 pb-12"
            >
              {/* Card 1: Handbuilding (The Explorer) */}
              <SwiperSlide>
                <div className="flex flex-col">
                  <div className="rounded-3xl overflow-hidden mb-4 h-[280px] sm:h-[320px] lg:aspect-[4/5] lg:h-auto bg-gray-200">
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <img
                        src={handbuildingImage}
                        alt="Handbuilding"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl mb-2">
                    <span className="italic">Handbuilding</span> (The Explorer)
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <Clock size={18} weight="bold" />
                    <span>2hrs</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 flex-grow">
                    A pottery technique where clay is molded by hand into unique
                    shapes and textures.
                  </p>
                </div>
              </SwiperSlide>

              {/* Card 2: Wheel Throwing (The Explorer) */}
              <SwiperSlide>
                <div className="flex flex-col">
                  <div className="rounded-3xl overflow-hidden mb-4 h-[280px] sm:h-[320px] lg:aspect-[4/5] lg:h-auto bg-gray-200">
                    <img
                      src={wheelthrowingImage}
                      alt="Wheel Throwing"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl mb-2">
                    <span className="italic">Wheel Throwing</span> (The
                    Explorer)
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <Clock size={18} weight="bold" />
                    <span>2hrs</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 flex-grow">
                    Wheel throwing is shaping clay on a spinning wheel to create
                    smooth, symmetrical forms.
                  </p>
                </div>
              </SwiperSlide>

              {/* Card 3: Painting on Ceramics */}
              <SwiperSlide>
                <div className="flex flex-col">
                  <div className="rounded-3xl overflow-hidden mb-4 h-[280px] sm:h-[320px] lg:aspect-[4/5] lg:h-auto bg-gray-200">
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <img
                        src={readyMadeImage}
                        alt="Painting on Ceramics"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl mb-2">
                    <span className="italic">Painting on Ceramics</span>
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <Clock size={18} weight="bold" />
                    <span>No Booking Required!</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 flex-grow">
                    Choose from a selection of cups, plates, and more, and enjoy
                    the freedom to paint and personalize each piece your way. No
                    experience needed, just come in, pick your piece, and start
                    creating.
                  </p>
                </div>
              </SwiperSlide>

              {/* Card 4: Open Studio */}
              <SwiperSlide>
                <div className="flex flex-col">
                  <div className="rounded-3xl overflow-hidden mb-4 h-[280px] sm:h-[320px] lg:aspect-[4/5] lg:h-auto bg-gray-200">
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <img
                        src={studioImage}
                        alt="Open Studio"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl mb-2">
                    <span className="italic">Open Studio</span>
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <Clock size={18} weight="bold" />
                    <span className="italic">Upon Enquiry</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 flex-grow">
                    Open Studio is a free-creation where you use our space,
                    tools, and materials to work at your own pace.
                  </p>
                </div>
              </SwiperSlide>

              {/* Card 6: Handbuilding (Mastery) */}
              <SwiperSlide>
                <div className="flex flex-col">
                  <div className="rounded-3xl overflow-hidden mb-4 h-[280px] sm:h-[320px] lg:aspect-[4/5] lg:h-auto bg-gray-200">
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <img
                        src={handbuildingMasteryImage}
                        alt="Handbuilding (Mastery)"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl mb-2">
                    <span className="italic">Handbuilding</span> (Mastery)
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <Clock size={18} weight="bold" />
                    <span>3hrs</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 flex-grow">
                    Handbuilding Advanced takes your skills further exploring
                    complex forms, refined techniques, and more creative freedom
                    in shaping clay.
                  </p>
                </div>
              </SwiperSlide>
            </Swiper>

            {/* Carousel Navigation Arrows */}
            <button
              ref={classesPrevRef}
              className="absolute left-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-105 -translate-x-1/2"
              aria-label="Previous class"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <button
              ref={classesNextRef}
              className="absolute right-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-105 translate-x-1/2"
              aria-label="Next class"
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </div>

          {/* Sole CTA for this section — the per-card "Book now" links were
              removed, so this is the one route into the catalog. */}
          <div className="text-center">
            <Button to="/classes" variant="outline" size="md">
              Book now
              <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </section>

      {/* About Us Section */}
      {data?.aboutUs && <AboutUs aboutUsData={data.aboutUs} />}
    </main>
  );
};

export default Home;
