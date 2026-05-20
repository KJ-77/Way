import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "Context/AuthContext";
import AccountHeader from "./components/AccountHeader";
import AccountTabs from "./components/AccountTabs";
import ProfileTab from "./components/tabs/ProfileTab";
import SubscriptionsTab from "./components/tabs/SubscriptionsTab";
import BookingsTab from "./components/tabs/BookingsTab";
import MyWorkTab from "./components/tabs/MyWorkTab";
import OrdersTab from "./components/tabs/OrdersTab";

// Maps tab id → component. Keeps the switch table out of the JSX.
const TAB_COMPONENTS = {
  profile: ProfileTab,
  subscriptions: SubscriptionsTab,
  bookings: BookingsTab,
  "my-work": MyWorkTab,
  orders: OrdersTab,
};

const Account = () => {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  // Gate the page: anyone hitting /auth/account without a session bounces to login.
  // Wait until isLoading settles so we don't redirect during the initial session restore.
  useEffect(() => {
    if (!isLoading && !user) navigate("/auth/login", { replace: true });
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading…</div>
      </div>
    );
  }

  const ActiveTabComponent = TAB_COMPONENTS[activeTab] ?? ProfileTab;

  return (
    <div className="min-h-screen bg-gray-50 lg:mt-large py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <AccountHeader user={user} />
        <AccountTabs activeTab={activeTab} onChange={setActiveTab} />
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <ActiveTabComponent user={user} />
        </div>
      </div>
    </div>
  );
};

export default Account;
