import { CreditCard } from "@phosphor-icons/react";
import TabEmptyState from "./TabEmptyState";

const SubscriptionsTab = () => (
  <TabEmptyState
    icon={CreditCard}
    title="No subscriptions yet"
    message="Your active plans and membership tiers will show up here once you're enrolled."
  />
);

export default SubscriptionsTab;
