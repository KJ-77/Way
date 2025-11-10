import React from "react";
import { IMAGE_URL } from "Utilities/BASE_URL";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
// Import required modules
import { Pagination } from "swiper/modules";

const ScheduleImageGallery = ({ images }) => {
  const hasImages = images && images.length > 0;

  if (!hasImages) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div className="swiper-container">
      <style jsx="true">{`
        .swiper-pagination-bullet {
          background: #000;
        }
        .swiper-pagination-bullet-active {
          background: #000;
        }
      `}</style>
      <Swiper
        spaceBetween={0}
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        loop={true}
        className="w-full  rounded-md overflow-hidden"
      >
        {images.map((image, index) => (
          <SwiperSlide className="flex items-center justify-center" key={index}>
            <img
              src={`${IMAGE_URL}${image}`}
              alt={`Schedule image ${index + 1}`}
              className="w-full h-[400px] rounded-[62px]  object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ScheduleImageGallery;
