import React, { useState, useEffect, useContext } from "react";
import AuthButton from "Components/auth/AuthButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "Components/Container/Container";
import { X } from "@phosphor-icons/react";
import blackLogo from "assests/black-logo.png";
import whiteLogo from "assests/white-logo.png";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import AuthContext from "Context/AuthContext";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { isLoggedIn, user } = useContext(AuthContext);
  const showWhiteOnHome = isHomePage && !isScrolled && isLargeScreen;

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    if (isHomePage) {
      // If on home page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      // If on other page, navigate to home with hash
      navigate(`/#${sectionId}`);
    }
  };

  // Handle hash navigation when component mounts or location changes
  useEffect(() => {
    if (isHomePage && location.hash) {
      const sectionId = location.hash.substring(1); // Remove the #
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100); // Small delay to ensure page is loaded
    }
  }, [isHomePage, location.hash]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if page is scrolled
      setIsScrolled(window.scrollY > 50);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close drawer on window resize (if screen becomes large)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint in Tailwind
        setIsDrawerOpen(false);
      }
      // Track lg breakpoint for color/logo decisions
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);

    // Initialize on mount
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Placeholder div to prevent content jump when header becomes fixed */}
      {/* {isScrolled && <div style={{ height: isScrolled ? "0px" : "0px" }} />} */}

      <header
        className={`transition-all duration-300 ease-in-out  h-max lg:fixed lg:top-0 lg:left-0 right-0 z-50 ${
          isScrolled
            ? "bg-white shadow-md"
            : isHomePage
            ? "bg-transparent"
            : "bg-white "
        }`}
      >
        <Container className="Container">
          <div
            className={`flex justify-between transition-all duration-300 ${
              isScrolled
                ? "py-1 items-center"
                : "lg:py-8 items-center  lg:items-start"
            }`}
          >
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src={`${showWhiteOnHome ? whiteLogo : blackLogo}`}
                alt="logo"
                className={`transition-all duration-300  ${
                  isScrolled ? "w-20 h-20" : "w-20 h-20 lg:w-28 lg:h-28"
                }`}
              />
            </Link>

            <nav className="hidden lg:flex space-x-14 h-max">
              <div className="relative ">
                <button
                  onClick={() => scrollToSection("our-space")}
                  className={`${
                    isScrolled
                      ? "text-gray-900"
                      : showWhiteOnHome
                      ? "text-white"
                      : "text-gray-900"
                  } hover:${
                    showWhiteOnHome ? "text-gray-300" : "text-gray-600"
                  } text-sm font-medium block transition-all duration-300`}
                >
                  Community
                </button>
                {!isScrolled && (
                  <ul
                    className={`absolute top-[100%] mt-6 text-xs italic   flex flex-col gap-y-1.5 left-0 min-w-max min-h-max ${
                      showWhiteOnHome ? "text-white" : "text-black"
                    } ${isScrolled ? "hidden" : "block"}`}
                  >
                    <li>
                      <button
                        onClick={() => scrollToSection("our-space")}
                        className="hover:opacity-70 transition-opacity"
                      >
                        Our Space
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("our-tutors")}
                        className="hover:opacity-70 transition-opacity"
                      >
                        Our Tutors
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection("our-coffeebar")}
                        className="hover:opacity-70 transition-opacity"
                      >
                        Our CoffeeBar
                      </button>
                    </li>
                  </ul>
                )}
              </div>
              <div className="relative">
                <Link
                  to="/schedule"
                  className={`${
                    isScrolled
                      ? "text-gray-900"
                      : showWhiteOnHome
                      ? "text-white"
                      : "text-gray-900"
                  } hover:${
                    showWhiteOnHome ? "text-gray-300" : "text-gray-600"
                  }  font-medium block transition-all duration-300 ${
                    isScrolled ? "text-sm" : "text-sm"
                  }`}
                >
                  Schedule
                </Link>
                {!isScrolled && (
                  <ul
                    className={`absolute top-[100%] mt-6 text-xs italic   flex flex-col gap-y-1.5 left-0 min-w-max min-h-max ${
                      showWhiteOnHome ? "text-white" : "text-black"
                    } ${isScrolled ? "hidden" : "block"}`}
                  >
                    <li>
                      <Link
                        to="/schedule"
                        className="hover:opacity-70 transition-opacity block"
                      >
                        Classes
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/schedule"
                        className="hover:opacity-70 transition-opacity block"
                      >
                        Book now
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/auth/register"
                        className="hover:opacity-70 transition-opacity block"
                      >
                        Become a member
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
              <Link
                to="/events"
                className={`${
                  isScrolled
                    ? "text-gray-900"
                    : showWhiteOnHome
                    ? "text-white"
                    : "text-gray-900"
                } hover:${
                  showWhiteOnHome ? "text-gray-300" : "text-gray-600"
                }  font-medium block transition-all duration-300 ${
                  isScrolled ? "text-sm" : "text-sm"
                }`}
              >
                Events
              </Link>
              <Link
                to="/events"
                className={`${
                  isScrolled
                    ? "text-gray-900"
                    : showWhiteOnHome
                    ? "text-white"
                    : "text-gray-900"
                } hover:${
                  showWhiteOnHome ? "text-gray-300" : "text-gray-600"
                }  font-medium block transition-all duration-300 ${
                  isScrolled ? "text-sm" : "text-sm"
                }`}
              >
                Contact
              </Link>
              <Link
                to="/shop"
                className={`relative flex items-center h-max gap-x-2 group ${
                  isScrolled
                    ? "text-gray-900"
                    : showWhiteOnHome
                    ? "text-white border border-white px-10 py-[2px] rounded-xl hover:bg-white hover:text-black"
                    : "text-gray-900 border border-black-900 px-6 py-[2px] rounded-xl"
                } hover:${
                  showWhiteOnHome ? "text-gray-300" : "text-gray-600"
                }  font-medium block transition-all duration-300 ${
                  isScrolled
                    ? "text-sm border border-black px-6 py-[2px] rounded-xl"
                    : "text-sm"
                }`}
              >
                Shop
                {!isScrolled && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight />
                  </span>
                )}
              </Link>
            </nav>

            <button
              className="lg:hidden flex items-center justify-center relative p-2 group"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
            >
              <div className="flex flex-col space-y-1.5 w-6">
                <span
                  className={`block h-0.5 w-6 transform transition-all duration-300 ${
                    isScrolled
                      ? "bg-black"
                      : showWhiteOnHome
                      ? "bg-white"
                      : "bg-black"
                  } group-hover:scale-110`}
                ></span>
                <span
                  className={`block h-0.5 w-4 transform transition-all duration-300 ${
                    isScrolled
                      ? "bg-black"
                      : showWhiteOnHome
                      ? "bg-white"
                      : "bg-black"
                  } group-hover:w-6 group-hover:scale-110`}
                ></span>
                <span
                  className={`block h-0.5 w-6 transform transition-all duration-300 ${
                    isScrolled
                      ? "bg-black"
                      : showWhiteOnHome
                      ? "bg-white"
                      : "bg-black"
                  } group-hover:scale-110`}
                ></span>
              </div>
            </button>
          </div>
        </Container>

        {/* Mobile drawer */}
        <div
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-all duration-500 ease-out ${
            isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-all duration-500 ease-out z-50 border-l border-gray-200/50 ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 h-full flex flex-col relative">
              {/* Close button */}
              <div className="absolute top-6 right-6">
                <button
                  className="w-10 h-10 rounded-full bg-gray-100/80 hover:bg-gray-200/80 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close menu"
                >
                  <X
                    size={20}
                    weight="bold"
                    className="text-gray-700 group-hover:text-gray-900"
                  />
                </button>
              </div>

              {/* Header */}
              <div className="pt-4 pb-12">
                <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mb-6"></div>
                <h2 className="text-2xl font-light text-gray-900 tracking-wide">
                  Navigation
                </h2>
                <p className="text-sm text-gray-500 mt-2 font-light">
                  Discover our spaces
                </p>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col space-y-2 flex-1">
                {[
                  {
                    action: () => scrollToSection("our-space"),
                    label: "Community",
                    delay: "100ms",
                  },
                  { to: "/schedule", label: "Schedule", delay: "200ms" },
                  { to: "/events", label: "Events", delay: "300ms" },
                  { to: "/shop", label: "Shop", delay: "400ms" },
                  {
                    to: "/auth/register",
                    label: "Become a Member",
                    delay: "500ms",
                  },
                ].map((item, index) => {
                  const handleClick = () => {
                    setIsDrawerOpen(false);
                    if (item.action) {
                      item.action();
                    }
                  };

                  if (item.to) {
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`group relative py-4 px-6 rounded-2xl text-gray-700 hover:text-gray-900 font-medium text-lg tracking-wide transition-all duration-300 hover:bg-gray-50/80 hover:shadow-sm transform hover:translate-x-2 ${
                          isDrawerOpen ? "animate-in slide-in-from-right-4" : ""
                        }`}
                        style={{
                          animationDelay: isDrawerOpen ? item.delay : "0ms",
                          animationDuration: "600ms",
                          animationFillMode: "both",
                        }}
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        <span className="relative z-10">{item.label}</span>
                        <div className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full transform -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                          <ArrowRight
                            size={16}
                            weight="bold"
                            className="text-gray-400"
                          />
                        </div>
                      </Link>
                    );
                  } else {
                    return (
                      <button
                        key={item.label}
                        className={`group relative py-4 px-6 rounded-2xl text-gray-700 hover:text-gray-900 font-medium text-lg tracking-wide transition-all duration-300 hover:bg-gray-50/80 hover:shadow-sm transform hover:translate-x-2 text-left ${
                          isDrawerOpen ? "animate-in slide-in-from-right-4" : ""
                        }`}
                        style={{
                          animationDelay: isDrawerOpen ? item.delay : "0ms",
                          animationDuration: "600ms",
                          animationFillMode: "both",
                        }}
                        onClick={handleClick}
                      >
                        <span className="relative z-10">{item.label}</span>
                        <div className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full transform -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                          <ArrowRight
                            size={16}
                            weight="bold"
                            className="text-gray-400"
                          />
                        </div>
                      </button>
                    );
                  }
                })}
              </nav>

              {/* Contact section */}
              <div className="mt-auto pt-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-6 border border-gray-200/50">
                  <div className="text-center">
                    {isLoggedIn ? (
                      <>
                        <p className="text-sm text-gray-600 font-light mb-2">
                          Welcome back, {user?.name || "Friend"}!
                        </p>
                        <p className="text-xs text-gray-500 font-light mb-4">
                          Explore your dashboard
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600 font-light mb-4">
                        Ready to join us?
                      </p>
                    )}
                    <div className="flex justify-center">
                      <AuthButton onClick={() => setIsDrawerOpen(false)} />
                    </div>
                  </div>
                </div>

                {/* Subtle footer */}
                <div className="text-center mt-6">
                  <p className="text-xs text-gray-400 font-light tracking-wider">
                    CRAFTED WITH CARE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
