import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "Context/AuthContext";

// Route guard for any page that requires a logged-in user.
//
// Mirrors the pattern previously duplicated inline in Account.jsx: waits for
// AuthContext.isLoading to settle so we don't redirect during the initial
// session restore, then redirects to /auth/login when there's no user.
// Preserves the requested URL as ?next= so login can bounce back after auth
// (the login page can honor this whenever it's wired up — deferred to a
// follow-up ticket).
//
// Usage:
//   <Route path="/classes" element={
//     <ProtectedRoute><Classes /></ProtectedRoute>
//   } />
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      const next = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth/login?next=${next}`, { replace: true });
    }
  }, [user, isLoading, navigate, location.pathname, location.search]);

  // Loading spinner during session restore + redirect flicker — keeps the
  // guarded child from mounting (and firing its fetch on mount) before we
  // know whether we're logged in.
  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading…</div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
