import { SealCheck, Warning } from "@phosphor-icons/react";

// Top banner for the Account page — avatar, display name, email, verified status.
const AccountHeader = ({ user }) => {
  const displayName = user?.name || user?.fullName || "Member";
  const initial = displayName[0]?.toUpperCase() || "?";
  const verified = !!user?.verified;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Avatar */}
        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
          <span className="text-2xl font-semibold text-gray-700">{initial}</span>
        </div>

        {/* Identity */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
            {displayName}
          </h1>
          {user?.email && (
            <p className="text-sm text-gray-600 truncate mt-1">{user.email}</p>
          )}

          {/* Verified pill */}
          <div className="mt-3 flex justify-center sm:justify-start">
            {verified ? (
              <span className="inline-flex items-center gap-x-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                <SealCheck size={14} weight="fill" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-x-1.5 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-800 text-xs font-medium border border-yellow-200">
                <Warning size={14} weight="fill" />
                Unverified
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHeader;
