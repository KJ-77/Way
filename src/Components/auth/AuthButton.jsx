import React, { useContext } from "react";
import { User } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import AuthContext from "Context/AuthContext";

const AuthButton = ({ darkMode, onClick }) => {
  const { isLoggedIn } = useContext(AuthContext);

  const handleClick = (e) => {
    // Call the onClick prop if provided (e.g., to close drawer)
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className="relative">
      <Link
        to={isLoggedIn ? "/auth/profile" : "/auth/login"}
        className={`flex items-center justify-center w-10 h-10 rounded-full ${
          darkMode
            ? "bg-white text-black hover:bg-gray-200"
            : "bg-black text-white hover:bg-gray-800"
        } transition-colors`}
        aria-label="Authentication options"
        onClick={handleClick}
      >
        <User size={20} weight="bold" />
      </Link>
    </div>
  );
};

export default AuthButton;
