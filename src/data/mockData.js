/**
 * Mock Data for Frontend Standalone Mode
 *
 * When MOCK_MODE is true in BASE_URL.jsx, all hooks return data from here
 * instead of making real API calls.
 *
 * To switch to real backend: set MOCK_MODE = false in Utilities/BASE_URL.jsx
 */

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
        "placeholder:CoffeeBar Interior:800:600",
        "placeholder:CoffeeBar Counter:800:600",
        "placeholder:CoffeeBar Seating:800:600",
      ],
    },
    our_tutors: {
      title: "Our Tutors",
      text: "Meet our talented team of artists and craftspeople who guide you on your creative journey.",
      gallery: [
        "placeholder:Tutor Portrait 1:800:600",
        "placeholder:Tutor Portrait 2:800:600",
      ],
    },
  },
};

// ============================================================
// SCHEDULE/CLASSES — GET /schedule
// ============================================================
export const mockScheduleData = {
  data: [
    {
      _id: "sched-1",
      title: "Handbuilding (The Explorer)",
      text: "<p>A pottery technique where clay is molded by hand into unique shapes and textures. Perfect for beginners looking to discover the art of ceramics.</p>",
      price: 45,
      images: [
        "placeholder:Handbuilding Class 1:800:400",
        "placeholder:Handbuilding Class 2:800:400",
        "placeholder:Handbuilding Class 3:800:400",
      ],
      sessions: [
        { _id: "sess-1a", startDate: futureDate(7), capacity: 12 },
        { _id: "sess-1b", startDate: futureDate(14), capacity: 12 },
        { _id: "sess-1c", startDate: futureDate(21), capacity: 12 },
      ],
    },
    {
      _id: "sched-2",
      title: "Wheel Throwing (The Explorer)",
      text: "<p>Wheel throwing is shaping clay on a spinning wheel to create smooth, symmetrical forms. Learn the fundamentals of centering and pulling.</p>",
      price: 55,
      images: [
        "placeholder:Wheel Throwing 1:800:400",
        "placeholder:Wheel Throwing 2:800:400",
      ],
      sessions: [
        { _id: "sess-2a", startDate: futureDate(5), capacity: 8 },
        { _id: "sess-2b", startDate: futureDate(12), capacity: 8 },
      ],
    },
    {
      _id: "sched-3",
      title: "Sculpting (All Levels)",
      text: "<p>Sculpting is shaping and carving clay or other materials to create expressive, three-dimensional art. Open to all skill levels.</p>",
      price: 50,
      images: [
        "placeholder:Sculpting Class 1:800:400",
        "placeholder:Sculpting Class 2:800:400",
      ],
      sessions: [
        { _id: "sess-3a", startDate: futureDate(3), capacity: 10 },
        { _id: "sess-3b", startDate: futureDate(10), capacity: 10 },
        { _id: "sess-3c", startDate: futureDate(17), capacity: 10 },
      ],
    },
    {
      _id: "sched-4",
      title: "Open Studio",
      text: "<p>Open Studio is a free-creation space where you use our tools and materials to work at your own pace. No structure, just pure creative freedom.</p>",
      price: 30,
      images: ["placeholder:Open Studio:800:400"],
      sessions: [
        { _id: "sess-4a", startDate: futureDate(2), capacity: 15 },
        { _id: "sess-4b", startDate: futureDate(9), capacity: 15 },
      ],
    },
    {
      _id: "sched-5",
      title: "Painting on Canvas",
      text: "<p>Painting on canvas is expressing ideas and emotions through color and texture on a blank surface. Explore acrylics, oils, and mixed media.</p>",
      price: 40,
      images: [
        "placeholder:Canvas Painting 1:800:400",
        "placeholder:Canvas Painting 2:800:400",
      ],
      sessions: [
        { _id: "sess-5a", startDate: futureDate(6), capacity: 12 },
        { _id: "sess-5b", startDate: futureDate(13), capacity: 12 },
      ],
    },
    {
      _id: "sched-6",
      title: "Handbuilding (Mastery)",
      text: "<p>Handbuilding Advanced takes your skills further — exploring complex forms, refined techniques, and more creative freedom in shaping clay.</p>",
      price: 65,
      images: [
        "placeholder:Advanced Handbuilding 1:800:400",
        "placeholder:Advanced Handbuilding 2:800:400",
        "placeholder:Advanced Handbuilding 3:800:400",
      ],
      sessions: [
        { _id: "sess-6a", startDate: futureDate(8), capacity: 8 },
        { _id: "sess-6b", startDate: futureDate(15), capacity: 8 },
      ],
    },
  ],
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
// CAPACITY — GET /api/registrations/schedule/:id/capacity
// ============================================================
export const getMockCapacity = (scheduleId) => {
  const schedule = mockScheduleData.data.find((s) => s._id === scheduleId);
  if (!schedule) return { data: { sessions: [] } };

  return {
    data: {
      sessions: schedule.sessions.map((s) => ({
        sessionId: s._id,
        paid: Math.floor(Math.random() * (s.capacity - 2)),
        totalCapacity: s.capacity,
      })),
    },
  };
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
