import { ShoppingBag } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import TabEmptyState from "./TabEmptyState";

const OrdersTab = () => (
  <TabEmptyState
    icon={ShoppingBag}
    title="No orders yet"
    message="Items you've purchased from the Way shop will show up here."
    cta={
      <Link
        to="/shop"
        className="mt-5 inline-flex items-center px-5 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Visit shop
      </Link>
    }
  />
);

export default OrdersTab;
