import { Routes, Route } from "react-router-dom";
import Home from "Pages/Home/Home";

// context
import { AuthProvider } from "Context/AuthContext";

// Auth Pages
import Login from "Pages/auth/login";
import Register from "Pages/auth/register";
import Profile from "Pages/auth/profile";
import Verify from "Pages/auth/verify";
import EditProfile from "Pages/auth/edit-profile";
import ChangePassword from "Pages/auth/change-password";
import SendVerificationCode from "Pages/auth/send-verification-code";
import VerifyResetCode from "Pages/auth/verify-reset-code";
import ResetPassword from "Pages/auth/reset-password";
import Schedule from "Pages/Schedule/Schedule";
import Event from "Pages/Events/Event";
import Shop from "./Pages/Shop/Shop";

import Header from "Layout/Header/Header";
import Footer from "Layout/Footer/Footer";
import useScrollToTop from "Hooks/useScrollToTop";

const App = () => {
  useScrollToTop();
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/events" element={<Event />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/profile" element={<Profile />} />
          <Route path="/auth/edit-profile" element={<EditProfile />} />
          <Route path="/auth/change-password" element={<ChangePassword />} />
          <Route path="/auth/verify" element={<Verify />} />
          <Route path="/shop" element={<Shop />} />
          <Route
            path="/auth/send-verification-code"
            element={<SendVerificationCode />}
          />
          <Route path="/auth/password/verify" element={<VerifyResetCode />} />
          <Route path="/auth/password/reset" element={<ResetPassword />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
