/**
 * Mock Data for Frontend Standalone Mode
 *
 * When MOCK_MODE is true in BASE_URL.jsx, all hooks return data from here
 * instead of making real API calls.
 *
 * To switch to real backend: set MOCK_MODE = false in Utilities/BASE_URL.jsx
 */

// Coffee bar photos — real bundled assets. Imported (not inline "placeholder:"
// strings) so Vite fingerprints them and emits hashed URLs; they then flow
// through resolveImageUrl() untouched, since they don't start with "placeholder:".
// Converted from the studio's iPhone .heic originals (see CLAUDE.local.md).
import coffeeBarMarbleBar from "assets/images/home/coffee-bar-marble-bar.webp";
import coffeeBarMural from "assets/images/home/coffee-bar-mural.webp";
import coffeeBarCommunalTable from "assets/images/home/coffee-bar-communal-table.webp";
import coffeeBarWindowSeating from "assets/images/home/coffee-bar-window-seating.webp";
import coffeeBarServiceCounter from "assets/images/home/coffee-bar-service-counter.webp";

// Tutor portraits — same bundled-asset passthrough as the coffee bar images above.
import instructor1 from "assets/images/home/instructor-1.webp";
import instructor2 from "assets/images/home/instructor-2.webp";
import instructor3 from "assets/images/home/instructor-3.webp";

// Past-event photo sets. Each event below carries an `images` array rather than
// the backend's single `image` field; EventCard renders whichever it finds, so
// this stays compatible with the live /event payload shape.
import glassBlowing1 from "assets/images/events/glass-blowing-1.webp";
import glassBlowing2 from "assets/images/events/glass-blowing-2.webp";
import glassBlowing3 from "assets/images/events/glass-blowing-3.webp";

import rattan1 from "assets/images/events/rattan-1.webp";
import rattan2 from "assets/images/events/rattan-2.webp";
import rattan3 from "assets/images/events/rattan-3.webp";
import rattan4 from "assets/images/events/rattan-4.webp";
import rattan5 from "assets/images/events/rattan-5.webp";

import sporting1 from "assets/images/events/sporting-1.webp";
import sporting2 from "assets/images/events/sporting-2.webp";
import sporting3 from "assets/images/events/sporting-3.webp";
import sporting4 from "assets/images/events/sporting-4.webp";

// Helper: generate future dates for sessions
const futureDate = (daysFromNow) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
};

// ============================================================
// HOME PAGE — GET /home
// ============================================================
export const mockHomeData = {
  data: [
    {
      _id: "home-1",
      title: "Find your Way",
      text: "A creative atelier in the heart of Beirut where art, community, and craft come together. Shape your story through pottery, painting, and sculpture.",
    },
  ],
  aboutUs: {
    _id: "about-1",
    page_title: "Come explore your Way",
    page_description:
      "Way is a creative atelier and coffeebar located on Rue du Liban, Beirut. We offer pottery, sculpture, painting classes, and a warm community space for artists of all levels.",
    banner_image: "placeholder:About Us Banner:1200:600",
    coffee_bar: {
      title: "Our CoffeeBar",
      text: "A cozy space to relax, create, and connect with fellow artists over a warm cup of coffee.",
      gallery: [
        coffeeBarMarbleBar,
        coffeeBarMural,
        coffeeBarCommunalTable,
        coffeeBarWindowSeating,
        coffeeBarServiceCounter,
      ],
    },
    our_tutors: {
      title: "Our Tutors",
      text: "Meet our talented team of artists and craftspeople who guide you on your creative journey.",
      gallery: [instructor1, instructor2, instructor3],
    },
  },
};

// ============================================================
// EVENTS — GET /event
// ============================================================
export const mockEventData = {
  data: [
    {
      _id: "evt-glass-blowing",
      title: "Glass Blowing Event",
      content:
        "<p>A unique studio experience exploring the art of molten glass. Guided by skilled artisans, participants shaped their own pieces through heat, movement, and creativity, discovering a new medium in an inspiring, hands-on setting.</p>",
      images: [glassBlowing1, glassBlowing2, glassBlowing3],
    },
    {
      _id: "evt-rattan",
      title: "Rattan Workshop",
      content:
        "<p>A hands-on workshop exploring the art of rattan weaving. Participants learned to shape and weave natural fibers into functional pieces, experiencing the beauty of slow, tactile craftsmanship in a warm studio setting.</p>",
      images: [rattan1, rattan2, rattan3, rattan4, rattan5],
    },
    {
      _id: "evt-sporting",
      title: "Ceramics by the Sea — Sporting",
      content:
        "<p>A special open-air ceramics experience set at Sporting Beach Club. Surrounded by sea views, participants shaped their own pieces in a relaxed, coastal setting, bringing together creativity, craft, and atmosphere.</p>",
      images: [sporting1, sporting2, sporting3, sporting4],
    },
  ],
};

// NOTE: the product-category / product fixtures that used to live here were
// removed with the /shop page. Re-add them if the shop comes back.

// ============================================================
// REGISTRATIONS — GET /registrations/my-registrations
// ============================================================
export const mockMyRegistrations = {
  data: {
    registrations: [],
  },
};

// ============================================================
// AUTH MOCK RESPONSES
// ============================================================
export const getMockLoginResponse = (email) => ({
  success: true,
  data: {
    user: {
      _id: "user-mock-1",
      fullName: "Demo User",
      email: email,
      phoneNumber: "+961 70 000 000",
      verified: true,
    },
    token: "mock-jwt-token-" + Date.now(),
  },
});

export const getMockRegisterResponse = (data) => ({
  success: true,
  data: {
    user: {
      _id: "user-mock-" + Date.now(),
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      verified: false,
    },
    token: "mock-jwt-token-" + Date.now(),
  },
});

// ============================================================
// GENERIC SUCCESS RESPONSES
// ============================================================
export const mockSuccessResponse = {
  success: true,
  message: "Operation completed successfully.",
};

export const mockContactResponse = {
  success: true,
  message: "Thank you! Your message has been received.",
};

export const mockVerifyResponse = {
  success: true,
  message: "Email verified successfully!",
  data: { verified: true },
};

export const mockRegistrationResponse = {
  success: true,
  message: "Registration submitted! Awaiting admin confirmation.",
  data: {
    status: "pending",
    paymentStatus: "unpaid",
  },
};
