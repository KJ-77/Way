// Shared empty/coming-soon state used by Subscriptions/Bookings/Orders tabs
// until their respective APIs are wired up.
const TabEmptyState = ({ icon: Icon, title, message, cta }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <Icon size={32} weight="regular" className="text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 max-w-sm">{message}</p>
      {cta}
    </div>
  );
};

export default TabEmptyState;
