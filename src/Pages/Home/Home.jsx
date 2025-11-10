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

      {/* About Us Section */}
      {data?.aboutUs && <AboutUs aboutUsData={data.aboutUs} />}
    </main>
  );
};

export default Home;
