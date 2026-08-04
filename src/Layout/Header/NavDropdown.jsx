import { Link } from "react-router-dom";
import { CaretDown } from "@phosphor-icons/react";

// Desktop hover dropdown, used by the "Community" and "Studio" nav groups.
//
// Opens on hover AND on keyboard focus (group-focus-within), so it stays usable
// without a mouse. Because it's driven purely by CSS state — not by `isScrolled`
// — it works identically over the hero and on the scrolled white bar; the old
// implementation rendered the sub-links only while `!isScrolled`, which is why
// they vanished as soon as you scrolled.
//
// The panel is a white card in both header states. Over the transparent hero the
// trigger text is white, but the panel itself stays dark-on-white so contrast is
// the same whether or not the page is scrolled.
//
// `items` entries are either `{ to }` for router links or `{ onClick }` for the
// smooth-scroll section jumps.
const ITEM_CLASSES =
  "block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors duration-200";

const NavDropdown = ({ label, items, light = false }) => (
  <div className="relative group">
    <button
      type="button"
      className={`flex items-center gap-x-1.5 text-base font-medium transition-colors duration-300 ${
        light
          ? "text-white hover:text-gray-300"
          : "text-gray-900 hover:text-gray-600"
      }`}
      aria-haspopup="true"
    >
      {label}
      <CaretDown
        size={12}
        weight="bold"
        className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
      />
    </button>

    {/* The pt-4 wrapper is a deliberate hover bridge — it keeps the pointer
        inside the group while it travels from the trigger down to the panel,
        so the menu doesn't flicker shut in the gap. */}
    <div className="absolute left-0 top-full pt-4 translate-y-1 opacity-0 invisible transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible">
      <ul className="min-w-[200px] overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
        {items.map((item) => (
          <li key={item.label}>
            {item.to ? (
              <Link to={item.to} className={ITEM_CLASSES}>
                {item.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className={`w-full text-left ${ITEM_CLASSES}`}
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default NavDropdown;
