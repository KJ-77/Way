import React, { useEffect, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import useInView from "Hooks/useInView";
import useFetch from "Hooks/useFetch";
import { IMAGE_URL, MOCK_MODE } from "Utilities/BASE_URL";
import { buildWhatsAppUrl } from "Utilities/contact";
import { resolveImageUrl } from "data/mockImages";
import { DotsLoader, IsError } from "Components/RequestHandler";
import Container from "Components/Container/Container";
import { WhatsappLogo, ArrowLeft, ArrowRight } from "@phosphor-icons/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Event.css";

// Prefilled WhatsApp message for the page-level inquiry CTA. The old per-event
// "Book now" modal (email + phone + message → POST /event/request) was removed
// along with the "Become a member" links — enquiries now go straight to the
// studio's WhatsApp instead of through a form.
const INQUIRY_MESSAGE =
  "Hi Way Beirut! I'd like to know more about your upcoming events.";

// Shared framing for every event photo: a fixed-height banner on small screens,
// a 4:5 portrait panel from lg up. Kept in one place so the single-image and
// carousel branches below can't drift apart.
const PHOTO_CLASS =
  "w-full h-[280px] sm:h-[350px] lg:aspect-[4/5] lg:h-auto object-cover";
const FRAME_CLASS = "rounded-2xl lg:rounded-[62px] overflow-hidden";

const resolveEventImage = (image) =>
  MOCK_MODE ? resolveImageUrl(image, IMAGE_URL) : `${IMAGE_URL}${image}`;

// The live /event payload carries a single `image`; the mock fixtures carry an
// `images` array so a past event can show its whole photo set. Accept either,
// so flipping /event to the real backend needs no change here.
const getEventImages = (event) => {
  if (Array.isArray(event.images) && event.images.length > 0) {
    return event.images;
  }
  return event.image ? [event.image] : [];
};

// Empty State Component
const EmptyEventState = () => (
  <Container className="min-h-screen flex items-center justify-center">
    <div className="text-center py-8 px-4 max-w-sm mx-auto">
      <div className="w-12 h-12 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h2 className="text-xl font-medium text-gray-800 mb-2">
        No Events Available
      </h2>
      <p className="text-gray-500 text-sm">Check back soon for new events</p>
    </div>
  </Container>
);

// Photo set for a single event. Renders a plain <img> when there's only one
// picture, and a Swiper carousel when there are several.
//
// `eager` is true only for the first card on the page — that image is the LCP
// candidate, so it must not be deferred. Everything else is lazy, which matters
// here because the full event set is a few megabytes of portrait photography.
const EventGallery = ({ event, eager }) => {
  // Navigation targets are held as refs rather than the CSS-selector strings
  // used elsewhere in the app: several carousels share this page, and class
  // selectors would make every card's arrows drive the first card's Swiper.
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const images = getEventImages(event);
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <img
        src={resolveEventImage(images[0])}
        alt={event.title}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`${PHOTO_CLASS} ${FRAME_CLASS}`}
      />
    );
  }

  const arrowClass =
    "absolute top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full " +
    "bg-white/80 text-primary shadow-md backdrop-blur-sm transition-all duration-200 " +
    "hover:bg-white hover:scale-110 focus-visible:outline focus-visible:outline-2 " +
    "focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <div className="event-gallery relative">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        loop
        // Swiper reads navigation targets during init, before React has
        // committed the buttons below — onBeforeInit patches in the real nodes.
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        pagination={{ clickable: true, dynamicBullets: true }}
        className={FRAME_CLASS}
      >
        {images.map((image, i) => (
          <SwiperSlide key={i}>
            <img
              src={resolveEventImage(image)}
              alt={`${event.title} — photo ${i + 1} of ${images.length}`}
              loading={eager && i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={PHOTO_CLASS}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        ref={prevRef}
        type="button"
        aria-label={`Previous photo of ${event.title}`}
        className={`${arrowClass} left-3 lg:left-5`}
      >
        <ArrowLeft size={20} weight="bold" />
      </button>
      <button
        ref={nextRef}
        type="button"
        aria-label={`Next photo of ${event.title}`}
        className={`${arrowClass} right-3 lg:right-5`}
      >
        <ArrowRight size={20} weight="bold" />
      </button>
    </div>
  );
};

// Event Card with Intersection Observer
const EventCard = ({ event, index }) => {
  // repeat animation on each scroll into view
  const { ref, isInView } = useInView(
    { threshold: 0.15, root: null, rootMargin: "0px 0px -10% 0px" },
    false,
    300
  );

  return (
    <div
      ref={ref}
      className={
        "group   transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform will-change-opacity " +
        (isInView
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-[0.98]")
      }
    >
      {/* Photos and copy swap sides on alternating cards */}
      <div
        className={`flex flex-col  gap-x-24 items-center ${
          index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        {/* min-w-0 is load-bearing: Swiper writes pixel widths onto its slides,
            and a flex item's default `min-width: auto` would then refuse to
            shrink below that, starving the copy column beside it. */}
        <div className="w-full min-w-0 lg:flex-[2] mb-6 lg:mb-0">
          <EventGallery event={event} eager={index === 0} />
        </div>

        <h3 className={`text-2xl text-primary mb-2 lg:hidden`}>{event.title}</h3>

        <div className="w-full min-w-0 lg:flex-1 relative z-10 flex flex-col h-full">
          <div
            className="text-primary  lg:text-xl lg:w-3/4"
            dangerouslySetInnerHTML={{
              __html: event.content,
            }}
          />
        </div>
      </div>

      <h3
        className={`text-2xl text-primary mt-6 hidden lg:block ${
          index % 2 === 0 ? "text-start" : "text-end"
        }`}
      >
        {event.title}
      </h3>
    </div>
  );
};

const Event = () => {
  const { data, loading, error, fetchData } = useFetch();

  const getdata = useCallback(async () => {
    await fetchData("/event");
  }, [fetchData]);

  useEffect(() => {
    getdata();
  }, [getdata]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 min-h-[80vh] items-center justify-center ">
        <DotsLoader />
        <p className="text-xl font-bold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <IsError message={error.message} />
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div>
        <EmptyEventState />
      </div>
    );
  }

  return (
    <Container className="py-6 sm:py-secondary md:py-primary lg:py-large">
      <div className="">
        <div className="">
          <h2 className="text-primary text-3xl lg:text-5xl mb-6 lg:mb-12">
            Be part of the events at{" "}
            <span className="italic text-secondary"> Way</span>
          </h2>
        </div>

        {/* Events Grid Layout */}
        <div className="flex flex-col gap-12 lg:gap-44">
          {data.data.map((event, index) => (
            <EventCard key={event._id} event={event} index={index} />
          ))}
        </div>
      </div>

      {/* Page-level inquiry CTA — one WhatsApp entry point for every event,
          replacing the per-card booking modal. */}
      <div className="mt-16 lg:mt-32 text-center">
        <p className="text-primary text-lg lg:text-xl mb-6">
          Interested in one of our events? Talk to us directly.
        </p>
        <a
          href={buildWhatsAppUrl(INQUIRY_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-x-2 rounded-xl border border-primary px-8 py-3 text-sm sm:text-base font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-white"
        >
          <WhatsappLogo size={20} weight="fill" />
          Inquire on WhatsApp
        </a>
      </div>
    </Container>
  );
};

export default Event;
