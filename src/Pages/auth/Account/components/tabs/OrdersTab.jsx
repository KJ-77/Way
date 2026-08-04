import { ShoppingBag } from "@phosphor-icons/react";
import TabEmptyState from "./TabEmptyState";

// The "Visit shop" CTA was dropped along with the /shop page — there's nowhere
// to send people yet, so the tab is a pure empty state until the shop returns.
const OrdersTab = () => (
  <TabEmptyState
    icon={ShoppingBag}
    title="No orders yet"
    message="Items you've purchased from the Way shop will show up here."
  />
);

export default OrdersTab;
