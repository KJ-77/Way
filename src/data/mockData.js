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
import coffeeBarInterior from "assets/images/home/coffee-bar-interior.webp";
import coffeeBarCounter from "assets/images/home/coffee-bar-counter.webp";
import coffeeBarSeating from "assets/images/home/coffee-bar-seating.webp";

// Tutor portraits — same bundled-asset passthrough as the coffee bar images above.
import instructor1 from "assets/images/home/instructor-1.webp";
import instructor2 from "assets/images/home/instructor-2.webp";
import instructor3 from "assets/images/home/instructor-3.webp";

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
      gallery: [coffeeBarInterior, coffeeBarCounter, coffeeBarSeating],
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
      _id: "evt-1",
      title: "Ceramics Night Market",
      content:
        "<p>Join us for an evening of handmade ceramics, live music, and artisan food. Browse unique pottery pieces from local makers and enjoy the vibrant atmosphere of Way.</p>",
      image: "placeholder:Ceramics Night Market:1000:400",
    },
    {
      _id: "evt-2",
      title: "Art & Wine Evening",
      content:
        "<p>Unwind with a glass of wine while painting on canvas in our intimate studio setting. No experience needed — just bring your creative spirit and we'll provide everything else.</p>",
      image: "placeholder:Art and Wine Evening:1000:400",
    },
    {
      _id: "evt-3",
      title: "Kids Pottery Workshop",
      content:
        "<p>A fun, hands-on pottery experience designed for children ages 6-12. Kids will learn basic handbuilding techniques and take home their own creation.</p>",
      image: "placeholder:Kids Pottery Workshop:1000:400",
    },
  ],
};

// ============================================================
// PRODUCT CATEGORIES — GET /product-categories
// ============================================================
export const mockProductCategories = {
  data: [
    { _id: "cat-1", title: "Ceramics" },
    { _id: "cat-2", title: "Art Prints" },
    { _id: "cat-3", title: "Handmade Goods" },
  ],
};

// ============================================================
// PRODUCTS — GET /products or /products/category/:id
// ============================================================
const allProducts = [
  {
    _id: "prod-1",
    name: "Handmade Mug",
    description: "A beautifully crafted ceramic mug, perfect for your morning coffee",
    price: 25,
    category: "cat-1",
  },
  {
    _id: "prod-2",
    name: "Ceramic Vase",
    description: "An elegant wheel-thrown vase with a natural glaze finish",
    price: 45,
    category: "cat-1",
  },
  {
    _id: "prod-3",
    name: "Bowl Set (3 pcs)",
    description: "Set of three nesting bowls in earthy tones",
    price: 60,
    category: "cat-1",
  },
  {
    _id: "prod-4",
    name: "Beirut Skyline Print",
    description: "A limited edition watercolor print of the Beirut coastline",
    price: 35,
    category: "cat-2",
  },
  {
    _id: "prod-5",
    name: "Abstract Series I",
    description: "Minimalist abstract art print on premium paper",
    price: 30,
    category: "cat-2",
  },
  {
    _id: "prod-6",
    name: "Woven Tote Bag",
    description: "Hand-woven cotton tote with artisan pattern",
    price: 40,
    category: "cat-3",
  },
  {
    _id: "prod-7",
    name: "Clay Incense Holder",
    description: "Sculptural incense holder crafted from local clay",
    price: 20,
    category: "cat-3",
  },
  {
    _id: "prod-8",
    name: "Ceramic Planter",
    description: "A charming planter for your favorite succulents",
    price: 35,
    category: "cat-1",
  },
];

export const mockAllProducts = { data: allProducts };

export const getMockProductsByCategory = (categoryId) => {
  if (categoryId === "all" || !categoryId) {
    return { data: allProducts };
  }
  return { data: allProducts.filter((p) => p.category === categoryId) };
};

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
