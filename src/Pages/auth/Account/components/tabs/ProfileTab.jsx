import { Link } from "react-router-dom";
import { PencilSimple, Key, EnvelopeSimple } from "@phosphor-icons/react";

// Read-only profile summary + quick actions. The actual edit/password screens
// still live at /auth/edit-profile and /auth/change-password.
const Field = ({ label, value }) => (
  <div className="py-3 border-b border-gray-100 last:border-b-0">
    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{label}</p>
    <p className="text-sm text-gray-900">{value || "—"}</p>
  </div>
);

const ActionRow = ({ to, icon: Icon, title, subtitle, cta }) => (
  <Link
    to={to}
    className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors group"
  >
    <div className="flex items-center gap-x-3">
      <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Icon size={18} weight="regular" className="text-gray-700" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
      {cta}
    </span>
  </Link>
);

const ProfileTab = ({ user }) => {
  return (
    <div className="space-y-8">
      {/* Personal info */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </h2>
        <div className="bg-gray-50/60 rounded-xl p-4 sm:p-6">
          <Field label="Full Name" value={user?.name || user?.fullName} />
          <Field label="Email" value={user?.email} />
          <Field label="Phone" value={user?.phone || user?.phoneNumber} />
        </div>
      </section>

      {/* Account actions */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Account Settings
        </h2>
        <div className="bg-gray-50/60 rounded-xl px-4 sm:px-6 py-2 divide-y divide-gray-100">
          <ActionRow
            to="/auth/edit-profile"
            icon={PencilSimple}
            title="Edit profile"
            subtitle="Update your name, email, or phone"
            cta="Edit →"
          />
          <ActionRow
            to="/auth/change-password"
            icon={Key}
            title="Change password"
            subtitle="Set a new password for your account"
            cta="Change →"
          />
          {!user?.verified && (
            <ActionRow
              to="/auth/verify"
              icon={EnvelopeSimple}
              title="Verify your email"
              subtitle="Confirm your email to unlock all features"
              cta="Verify →"
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfileTab;
