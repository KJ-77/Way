import { X, WhatsappLogo } from "@phosphor-icons/react";
import { buildWhatsAppUrl, WAY_WHATSAPP_DISPLAY } from "../../../Utilities/contact";

const formatBookingDate = (yyyyMmDd) => {
  if (!yyyyMmDd) return "";
  return new Date(`${yyyyMmDd}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

const trimHhMm = (t) => (t || "").slice(0, 5);

// Copy variants — controlled by the `mode` prop:
//   "missing-sub" : shown when a client tries to book a class they don't
//                   have a matching active subscription for.
//   "buy"         : shown when they explicitly tap "Buy subscription".
const COPY = {
  "missing-sub": {
    title: "No active subscription",
    body: (className) =>
      `You don't have an active subscription for ${className || "this class"} yet. Message us on WhatsApp and we'll set you up.`,
    cta: "Message us on WhatsApp",
    prefill: ({ className, classDate, startTime }) =>
      `Hi Way! I'd like to book ${className || "a class"} on ${formatBookingDate(classDate)} at ${trimHhMm(startTime)}, but I don't have an active subscription. Can you set me up?`,
  },
  buy: {
    title: "Buy a subscription",
    body: (className) =>
      `Purchases still go through us for now. Message us on WhatsApp and we'll activate a ${className || "class"} subscription for you.`,
    cta: "Message us on WhatsApp",
    prefill: ({ className }) =>
      `Hi Way! I'd like to buy a subscription for ${className || "a class"}. What are my options?`,
  },
};

// Contact-staff modal shown in two flows (see COPY above). Uses buildWhatsAppUrl
// so the WA number lives in Utilities/contact.js — one source of truth.
//
// Props:
//   mode      — "missing-sub" | "buy"
//   slot      — the slot they were looking at (used to build the prefill)
//   classDate — "YYYY-MM-DD"
//   onClose   — dismiss
const ContactStaffModal = ({ mode, slot, classDate, onClose }) => {
  const copy = COPY[mode] ?? COPY.buy;
  const className = slot?.class_type_name || slot?.package || "";
  const bodyText = copy.body(className);
  const waUrl = buildWhatsAppUrl(
    copy.prefill({ className, classDate, startTime: slot?.start_time })
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-lg font-medium text-[#5a4434]">{copy.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#a6826e] hover:text-[#5a4434] transition-colors"
            aria-label="Close"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <p className="text-sm text-[#7a5d4d] mb-5 leading-relaxed">{bodyText}</p>

        {/* External link — opens WhatsApp mobile app on mobile, wa.me web on desktop */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-x-2 px-4 py-3 rounded-xl bg-[#25D366] text-white text-sm font-medium hover:bg-[#1fbb58] transition-colors"
          onClick={() => {
            // Close the modal after opening WhatsApp — user has completed the
            // intended action from Way's perspective. Slight delay so the new
            // tab has time to actually spawn on iOS Safari.
            setTimeout(onClose, 100);
          }}
        >
          <WhatsappLogo size={20} weight="bold" />
          {copy.cta}
        </a>
        <p className="text-xs text-center text-[#a6826e] mt-3">
          {WAY_WHATSAPP_DISPLAY}
        </p>
      </div>
    </div>
  );
};

export default ContactStaffModal;
