import { Routes, Route, Navigate } from "react-router-dom";
import Home from "Pages/Home/Home";

// context
import { AuthProvider } from "Context/AuthContext";

// Auth Pages
import Login from "Pages/auth/login";
import Register from "Pages/auth/register";
import Account from "Pages/auth/Account/Account";
import Verify from "Pages/auth/verify";
import EditProfile from "Pages/auth/edit-profile";
import ChangePassword from "Pages/auth/change-password";
import SendVerificationCode from "Pages/auth/send-verification-code";
import VerifyResetCode from "Pages/auth/verify-reset-code";
import ResetPassword from "Pages/auth/reset-password";
import Classes from "Pages/Classes/Classes";
import ClassPackages from "Pages/Classes/ClassPackages";
import WeeklySchedule from "Pages/WeeklySchedule/WeeklySchedule";
import Event from "Pages/Events/Event";
import Shop from "Pages/Shop/Shop";
import ProtectedRoute from "Components/auth/ProtectedRoute";

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
          {/* /classes and /schedule are gated per the studio's request —
              anonymous browsing is disabled. Session-restore + redirect logic
              lives in <ProtectedRoute>. */}
          <Route
            path="/classes"
            element={
              <ProtectedRoute>
                <Classes />
              </ProtectedRoute>
            }
          />
          {/* Drill-down: the packages that belong to one class type. */}
          <Route
            path="/classes/:classTypeId"
            element={
              <ProtectedRoute>
                <ClassPackages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <WeeklySchedule />
              </ProtectedRoute>
            }
          />
          <Route path="/events" element={<Event />} />
          {/* Placeholder page — the real shop catalog isn't built yet. */}
          <Route path="/shop" element={<Shop />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route
            path="/auth/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route path="/auth/profile" element={<Navigate to="/auth/account" replace />} />
          <Route path="/auth/edit-profile" element={<EditProfile />} />
          <Route path="/auth/change-password" element={<ChangePassword />} />
          <Route path="/auth/verify" element={<Verify />} />
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
