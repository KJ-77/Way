import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, SignOut, CaretDown } from "@phosphor-icons/react";
import AuthContext from "Context/AuthContext";

// Renders the user-related navbar control. Two modes depending on auth state:
//   - logged-out: a simple "Login" link with a user icon
//   - logged-in: a user icon that toggles a dropdown menu (My Account, Sign out)
// The `light` prop flips text color to white for the transparent-on-home variant.
const UserNavControl = ({ light = false }) => {
  const { isLoggedIn, user, logoutHandler } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  // Gates the sign-out — clicking the menu item opens the confirmation modal
  // and the actual logout only fires from the modal's confirm button.
  const [confirmOpen, setConfirmOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Close the dropdown when clicking outside the menu or pressing Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e) => {
      if (!containerRef.current?.contains(e.target)) setIsOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  // Allow Escape to dismiss the confirmation modal without signing out.
  useEffect(() => {
    if (!confirmOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setConfirmOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [confirmOpen]);

  // Opens the confirmation modal — actual sign-out is deferred to confirmSignOut.
  const handleSignOutClick = () => {
    setIsOpen(false);
    setConfirmOpen(true);
  };

  const confirmSignOut = () => {
    setConfirmOpen(false);
    logoutHandler();
    navigate("/");
  };

  const textColor = light ? "text-white" : "text-gray-900";
  const hoverColor = light ? "hover:text-gray-300" : "hover:text-gray-600";

  // Logged out — simple Login link, color-matched to current navbar variant.
  if (!isLoggedIn) {
    return (
      <Link
        to="/auth/login"
        className={`flex items-center gap-x-2 text-sm font-medium transition-colors duration-300 ${textColor} ${hoverColor}`}
        aria-label="Sign in"
      >
        <User size={18} weight="regular" />
        <span>Login</span>
      </Link>
    );
  }

  // Logged in — derive a display name + initial for the dropdown header.
  const displayName = user?.name || user?.fullName || user?.email || "Account";
  const initial = displayName[0]?.toUpperCase() || "?";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center gap-x-1.5 text-sm font-medium transition-colors duration-300 ${textColor} ${hoverColor}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Account menu"
      >
        <User size={20} weight="bold" />
        <CaretDown
          size={12}
          weight="bold"
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown panel — animates open/closed, anchored top-right under the trigger. */}
      <div
        className={`absolute right-0 top-full mt-3 min-w-[240px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden origin-top-right transition-all duration-200 ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        role="menu"
      >
        {/* User preview row */}
        <div className="flex items-center gap-x-3 px-4 py-3 border-b border-gray-100">
          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-gray-700">
              {initial}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </p>
            {user?.email && (
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            )}
          </div>
        </div>

        {/* Menu items */}
        <Link
          to="/auth/account"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          role="menuitem"
        >
          <User size={16} weight="regular" />
          My Account
        </Link>
        <button
          type="button"
          onClick={handleSignOutClick}
          className="w-full flex items-center gap-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
          role="menuitem"
        >
          <SignOut size={16} weight="regular" />
          Sign out
        </button>
      </div>

      {/* Confirmation modal — gates the sign-out so a misclick doesn't kill the session. */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signout-confirm-title"
          onClick={(e) => {
            // Click on the backdrop dismisses; clicks inside the panel don't bubble here
            if (e.target === e.currentTarget) setConfirmOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 id="signout-confirm-title" className="text-lg font-semibold text-gray-900">
              Sign out?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              You'll need to sign back in to access your account.
            </p>
            <div className="mt-6 flex justify-end gap-x-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSignOut}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNavControl;
