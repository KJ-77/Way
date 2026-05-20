import { UserCircle, CreditCard, CalendarCheck, Palette, ShoppingBag } from "@phosphor-icons/react";

// Horizontal tab bar for the Account page. Stateless — receives the current tab
// and a setter from the parent so the URL or future deep-linking could be added later.
const TABS = [
  { id: "profile", label: "Profile", Icon: UserCircle },
  { id: "subscriptions", label: "Subscriptions", Icon: CreditCard },
  { id: "bookings", label: "Bookings", Icon: CalendarCheck },
  { id: "my-work", label: "My Work", Icon: Palette },
  { id: "orders", label: "Orders", Icon: ShoppingBag },
];

const AccountTabs = ({ activeTab, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex overflow-x-auto scrollbar-hide">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex items-center gap-x-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                isActive
                  ? "border-black text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} weight={isActive ? "fill" : "regular"} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AccountTabs;
