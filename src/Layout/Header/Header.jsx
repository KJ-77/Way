import React, { useState, useEffect, useContext } from "react";
import AuthButton from "Components/auth/AuthButton";
import UserNavControl from "Components/auth/UserNavControl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "Components/Container/Container";
import { X } from "@phosphor-icons/react";
import blackLogo from "assets/black-logo.webp";
import whiteLogo from "assets/white-logo.webp";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import AuthContext from "Context/AuthContext";
import NavDropdown from "./NavDropdown";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { isLoggedIn, user } = useContext(AuthContext);
  // On the home hero (before scrolling) the header floats over the full-screen
  // carousel — white logo/nav on a transparent bg — at every breakpoint. Once
  // scrolled it flips to the solid white bar. Applies on mobile too now, not
  // just desktop.
  const showWhiteOnHome = isHomePage && !isScrolled;

  // Home page: the header is fixed over the hero at all sizes so the carousel
  // fills the screen. Other pages keep the original behavior — fixed only from
  // lg up — so the in-flow mobile header keeps reserving space above content
  // (those pages have small mobile top margins and would otherwise slide under
  // a fixed header).
  const positionClasses = isHomePage
    ? "fixed top-0 left-0 right-0"
    : "lg:fixed lg:top-0 lg:left-0 right-0";

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

  // Shared nav model — the desktop dropdowns and the mobile drawer render from
  // the same definitions so the two menus can't drift apart.
  const communityItems = [
    { label: "Our Space", onClick: () => scrollToSection("our-space") },
    { label: "Our Tutors", onClick: () => scrollToSection("our-tutors") },
    { label: "Our CoffeeBar", onClick: () => scrollToSection("our-coffeebar") },
  ];

  // "Studio" merges what used to be two separate top-level entries (Classes and
  // Schedule). Classes is surfaced as "Packages" per the studio's naming.
  const studioItems = [
    { label: "Packages", to: "/classes" },
    { label: "Schedule", to: "/schedule" },
  ];

  // Shared class string for the plain top-level links, so Events/Contact match
  // the dropdown triggers exactly (same size, same weight, no italics).
  const topLinkClasses = `text-base font-medium block transition-colors duration-300 ${
    showWhiteOnHome
      ? "text-white hover:text-gray-300"
      : "text-gray-900 hover:text-gray-600"
  }`;

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

  // Close the mobile drawer if the screen grows past the mobile breakpoint.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint in Tailwind
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header
        className={`transition-all duration-300 ease-in-out h-max z-50 ${positionClasses} ${
          isScrolled
            ? "bg-white shadow-md"
            : isHomePage
              ? "bg-transparent"
              : "bg-white "
        }`}
      >
        <Container className="Container">
          {/* Everything is vertically centered now. The old `lg:items-start`
              existed so the always-visible sub-links had room below the nav —
              with the dropdowns on hover, centering reads better. */}
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              isScrolled ? "py-1" : "lg:py-8"
            }`}
          >
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src={`${showWhiteOnHome ? whiteLogo : blackLogo}`}
                alt="logo"
                width={isScrolled ? 80 : 112}
                height={isScrolled ? 80 : 112}
                className={`transition-all duration-300 ${
                  isScrolled
                    ? "w-[80px] h-[80px]"
                    : "w-[80px] h-[80px] lg:w-[112px] lg:h-[112px]"
                }`}
              />
            </Link>

            <nav className="hidden lg:flex items-center space-x-12 h-max">
              <NavDropdown
                label="Community"
                items={communityItems}
                light={showWhiteOnHome}
              />
              <NavDropdown
                label="Studio"
                items={studioItems}
                light={showWhiteOnHome}
              />
              <Link to="/events" className={topLinkClasses}>
                Events
              </Link>
              <Link to="/events" className={topLinkClasses}>
                Contact
              </Link>
              {/* Routes to the "coming soon" placeholder until the real catalog
                  is built. */}
              <Link
                to="/shop"
                className={`relative flex items-center h-max gap-x-2 text-base font-medium rounded-xl px-8 py-[3px] transition-colors duration-300 ${
                  showWhiteOnHome
                    ? "text-white border border-white hover:bg-white hover:text-primary"
                    : "text-gray-900 border border-black hover:bg-black hover:text-white"
                }`}
              >
                Shop
              </Link>

              {/* Auth control — shows Login button when logged out, user dropdown when logged in */}
              <UserNavControl light={showWhiteOnHome} />
            </nav>

            <button
              className={`lg:hidden flex items-center justify-center relative p-3 rounded-lg group transition-all duration-300 ${
                showWhiteOnHome ? "hover:bg-white/10" : "hover:bg-black/5"
              }`}
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
            >
              <div className="flex flex-col space-y-1.5 w-6">
                <span
                  className={`block h-0.5 w-6 transform transition-all duration-300 ${
                    showWhiteOnHome ? "bg-white" : "bg-black"
                  } group-hover:scale-110`}
                ></span>
                <span
                  className={`block h-0.5 w-4 transform transition-all duration-300 ${
                    showWhiteOnHome ? "bg-white" : "bg-black"
                  } group-hover:w-6 group-hover:scale-110`}
                ></span>
                <span
                  className={`block h-0.5 w-6 transform transition-all duration-300 ${
                    showWhiteOnHome ? "bg-white" : "bg-black"
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
            className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-all duration-500 ease-out z-50 border-l border-gray-200/50 overflow-y-auto ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 min-h-full flex flex-col relative">
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
              <div className="pt-4 pb-10">
                <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mb-6"></div>
                <h2 className="text-2xl font-light text-gray-900 tracking-wide">
                  Navigation
                </h2>
                <p className="text-sm text-gray-500 mt-2 font-light">
                  Discover our spaces
                </p>
              </div>

              {/* Navigation — mirrors the desktop structure: Community and Studio
                  are groups whose children are listed inline (no accordion, so
                  everything is one tap away on touch). */}
              <nav className="flex flex-col gap-y-6 flex-1">
                <MobileNavGroup
                  label="Community"
                  items={communityItems}
                  onNavigate={() => setIsDrawerOpen(false)}
                />
                <MobileNavGroup
                  label="Studio"
                  items={studioItems}
                  onNavigate={() => setIsDrawerOpen(false)}
                />
                <div className="flex flex-col">
                  <MobileNavLink to="/events" onNavigate={() => setIsDrawerOpen(false)}>
                    Events
                  </MobileNavLink>
                  <MobileNavLink to="/events" onNavigate={() => setIsDrawerOpen(false)}>
                    Contact
                  </MobileNavLink>
                  <MobileNavLink to="/shop" onNavigate={() => setIsDrawerOpen(false)}>
                    Shop
                  </MobileNavLink>
                </div>
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

// ── Mobile drawer building blocks ──
// Kept local to the header: they only exist to render the shared nav model in
// the drawer and have no use anywhere else.

const MOBILE_ROW_CLASSES =
  "group relative py-3.5 px-5 rounded-2xl text-gray-700 hover:text-gray-900 font-medium text-lg tracking-wide transition-all duration-300 hover:bg-gray-50/80 text-left";

const MobileRowDecoration = () => (
  <>
    <div className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full transform -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
      <ArrowRight size={16} weight="bold" className="text-gray-400" />
    </div>
  </>
);

const MobileNavLink = ({ to, onNavigate, children }) => (
  <Link to={to} className={MOBILE_ROW_CLASSES} onClick={onNavigate}>
    <span className="relative z-10">{children}</span>
    <MobileRowDecoration />
  </Link>
);

// A group header plus its children. The header is a label, not a target — every
// destination in the group is reachable from the rows beneath it.
const MobileNavGroup = ({ label, items, onNavigate }) => (
  <div>
    <p className="px-5 mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
      {label}
    </p>
    <div className="flex flex-col">
      {items.map((item) =>
        item.to ? (
          <MobileNavLink key={item.label} to={item.to} onNavigate={onNavigate}>
            {item.label}
          </MobileNavLink>
        ) : (
          <button
            key={item.label}
            type="button"
            className={MOBILE_ROW_CLASSES}
            onClick={() => {
              onNavigate();
              item.onClick?.();
            }}
          >
            <span className="relative z-10">{item.label}</span>
            <MobileRowDecoration />
          </button>
        )
      )}
    </div>
  </div>
);

export default Header;
