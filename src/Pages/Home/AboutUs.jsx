import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ArrowLeft, ArrowRight, ArrowRightIcon } from "@phosphor-icons/react";
import { IMAGE_URL } from "Utilities/BASE_URL";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const AboutUs = ({ aboutUsData }) => {
  if (!aboutUsData) return null;

  const { page_title, page_description, banner_image, coffee_bar, our_tutors } =
    aboutUsData;

  return (
    <section id="our-space" className="bg-white py-secondary lg:py-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title and Description */}
        <div className="mb-10 lg:mb-24 lg:w-3/4 mx-auto">
          <h2 className="text-primary text-3xl lg:text-5xl mb-6 lg:mb-12">
            {page_title
              ? (() => {
                  const words = page_title.split(" ");
                  if (words.length === 1) {
                    return (
                      <>
                        <span className="special-last-word">{words[0]}</span>
                      </>
                    );
                  }
                  return (
                    <>
                      {words.slice(0, -1).join(" ")}{" "}
                      <span className="text-secondary italic">
                        {words[words.length - 1]}
                      </span>
                    </>
                  );
                })()
              : null}
          </h2>
          <p className="lg:w-3/4 text-xl text-primary">{page_description}</p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8">
            <Link
              to="/auth/register"
              className="text-sm underline flex items-center hover:text-secondary transition-colors duration-200"
            >
              Become a member
              <ArrowRightIcon size={14} className="ml-2" />
            </Link>
            <Link
              to="/schedule"
              className="text-sm underline flex items-center hover:text-secondary transition-colors duration-200"
            >
              Book now
              <ArrowRightIcon size={14} className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Banner Image */}
        <div className="mb-10">
          <img
            src={`${IMAGE_URL}${banner_image}`}
            alt="About Us Banner"
            className="w-full lg:h-[600px] object-cover rounded-[32px]"
          />
        </div>

        {/* Coffee Bar and Our Tutors Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10">
          {/* Coffee Bar Section */}
          {coffee_bar && (
            <div id="our-coffeebar" className="space-y-6">
              {/* Coffee Bar Gallery */}
              {coffee_bar.gallery && coffee_bar.gallery.length > 0 && (
                <div className="coffee-bar-container">
                  <div className="relative">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      spaceBetween={20}
                      slidesPerView={1}
                      navigation={{
                        prevEl: ".coffee-bar-prev",
                        nextEl: ".coffee-bar-next",
                      }}
                      pagination={{
                        clickable: true,
                        dynamicBullets: true,
                      }}
                      loop={coffee_bar.gallery.length > 1}
                      className="rounded-2xl lg:rounded-[32px] overflow-hidden"
                    >
                      {coffee_bar.gallery.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={`${IMAGE_URL}${image}`}
                            alt={`Coffee Bar ${index + 1}`}
                            className="w-full h-[400px] lg:h-[600px] object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  <div className="text-center lg:w-1/2 mx-auto mt-6">
                    <h3 className="text-2xl lg:text-3xl font-light italic text-primary mb-4">
                      {coffee_bar.title}
                    </h3>
                    <p className="text-xl text-primary mb-8">
                      {coffee_bar.text}
                    </p>

                    {/* Custom Navigation Buttons - Under Text */}
                    {coffee_bar.gallery.length > 1 && (
                      <div className="flex items-center justify-center gap-10">
                        <button className="coffee-bar-prev text-primary transition-all duration-200 hover:scale-110 hover:text-secondary">
                          <ArrowLeft size={28} />
                        </button>
                        <button className="coffee-bar-next text-primary transition-all duration-200 hover:scale-110 hover:text-secondary">
                          <ArrowRight size={28} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Our Tutors Section */}
          {our_tutors && (
            <div id="our-tutors" className="space-y-6">
              {/* Our Tutors Gallery */}
              {our_tutors.gallery && our_tutors.gallery.length > 0 && (
                <div className="tutors-container">
                  <div className="relative">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      spaceBetween={20}
                      slidesPerView={1}
                      navigation={{
                        prevEl: ".tutors-prev",
                        nextEl: ".tutors-next",
                      }}
                      pagination={{
                        clickable: true,
                        dynamicBullets: true,
                      }}
                      loop={our_tutors.gallery.length > 1}
                      className="rounded-2xl lg:rounded-[32px] overflow-hidden"
                    >
                      {our_tutors.gallery.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={`${IMAGE_URL}${image}`}
                            alt={`Our Tutors ${index + 1}`}
                            className="w-full   h-[400px] lg:h-[600px] object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  <div className="text-center lg:w-1/2 mx-auto mt-6">
                    <h3 className="text-2xl lg:text-3xl font-light italic text-primary mb-4">
                      {our_tutors.title}
                    </h3>
                    <p className="text-xl text-primary mb-8">
                      {our_tutors.text}
                    </p>

                    {/* Custom Navigation Buttons - Under Text */}
                    {our_tutors.gallery.length > 1 && (
                      <div className="flex items-center justify-center gap-10">
                        <button className="tutors-prev text-primary transition-all duration-200 hover:scale-110 hover:text-secondary">
                          <ArrowLeft size={28} />
                        </button>
                        <button className="tutors-next text-primary transition-all duration-200 hover:scale-110 hover:text-secondary">
                          <ArrowRight size={28} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom Swiper Styles */}
      <style jsx>{`
        .swiper-pagination-bullet {
          background: #421f19;
          opacity: 0.3;
        }
        .swiper-pagination-bullet-active {
          background: #421f19;
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default AboutUs;
