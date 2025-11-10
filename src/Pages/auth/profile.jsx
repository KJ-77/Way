import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "Components/form/Button";
import AuthContext from "Context/AuthContext";
const Profile = () => {
  const { user, logoutHandler } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    logoutHandler();
    navigate("/");
  };

  return (
    <div className="lg:min-h-screen bg-white lg:mt-large py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account information and settings
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl font-medium text-gray-500">
                  {user?.fullName[0]}
                </span>
              </div>
            </div>

            <div className="flex-grow text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-900">
                {user?.fullName}
              </h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                Member since: {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <Button
                variant="secondary"
                onClick={() => {
                  if (user?.verified) {
                    navigate("/auth/edit-profile");
                  } else {
                    alert(
                      "You need to verify your email before editing your profile."
                    );
                  }
                }}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Account Settings
            </h3>

            <div className="space-y-4">
              {!user?.verified && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Email verification
                    </h4>
                    <p className="text-xs text-gray-500">
                      Verify your email address to secure your account
                    </p>
                  </div>
                  <Link to="/auth/verify">
                    <Button variant="link">Verify email</Button>
                  </Link>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Change password
                  </h4>
                  <p className="text-xs text-gray-500">
                    Update your password regularly for better security
                  </p>
                </div>
                <Button
                  variant="link"
                  onClick={() => {
                    if (user?.verified) {
                      navigate("/auth/change-password");
                    } else {
                      alert(
                        "You need to verify your email before changing your password."
                      );
                    }
                  }}
                >
                  Change
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={logout}
              variant="secondary"
              className="text-red-600 hover:text-red-700 border-red-200"
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
