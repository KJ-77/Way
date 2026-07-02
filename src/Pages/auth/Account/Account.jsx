import { useContext, useState } from "react";
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

// Route-level auth guard now lives in <ProtectedRoute> (wraps this component
// in App.jsx). By the time we render, `user` is guaranteed non-null.
const Account = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");

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
