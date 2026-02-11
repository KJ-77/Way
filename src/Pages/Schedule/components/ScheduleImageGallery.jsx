import React, { useRef } from "react";
import { IMAGE_URL, MOCK_MODE } from "Utilities/BASE_URL";
import { resolveImageUrl } from "data/mockImages";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// Import required modules
import { Pagination, Navigation } from "swiper/modules";

const ScheduleImageGallery = ({ images }) => {
  const hasImages = images && images.length > 0;
  const hasMultiple = images && images.length > 1;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!hasImages) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div className="swiper-container group relative">
      <style jsx="true">{`
        .swiper-pagination-bullet {
          background: #421f19;
          opacity: 0.3;
        }
        .swiper-pagination-bullet-active {
          background: #421f19;
          opacity: 1;
        }
        .swiper-button-disabled {
          opacity: 0.3 !important;
          cursor: default !important;
        }
      `}</style>
      <Swiper
        spaceBetween={0}
        pagination={{
          dynamicBullets: true,
        }}
        navigation={
          hasMultiple
            ? {
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }
            : false
        }
        onBeforeInit={(swiper) => {
          if (hasMultiple && swiper.params.navigation) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        modules={[Pagination, Navigation]}
        loop={hasMultiple}
        className="w-full rounded-md overflow-hidden"
      >
        {images.map((image, index) => (
          <SwiperSlide className="flex items-center justify-center" key={index}>
            <img
              src={MOCK_MODE ? resolveImageUrl(image, IMAGE_URL) : `${IMAGE_URL}${image}`}
              alt={`Class ${index + 1}`}
              className="w-full h-[280px] sm:h-[350px] md:h-[400px] lg:aspect-[4/5] lg:h-auto rounded-[62px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      {hasMultiple && (
        <>
          <button
            ref={prevRef}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-primary shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-105"
            aria-label="Previous image"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <button
            ref={nextRef}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-primary shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-105"
            aria-label="Next image"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        </>
      )}
    </div>
  );
};

export default ScheduleImageGallery;
