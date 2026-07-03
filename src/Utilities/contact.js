// Central place for Way Beirut's contact channels. If the studio ever changes
// number, swap it here and every CTA in the app updates.

// E.164 without the leading "+" — that's what wa.me expects in the URL path.
// Lebanon country code (961) + local 8-digit mobile.
export const WAY_WHATSAPP_E164 = "96176717406";

// Human-readable phone for display in copy ("+961 76 717 406").
export const WAY_WHATSAPP_DISPLAY = "+961 76 717 406";

// Builds a WhatsApp deep link with an optional prefilled message body.
// Encodes so line breaks, emoji, and Arabic all survive the round-trip.
// Falls back to a plain wa.me URL when no text is provided.
export function buildWhatsAppUrl(text) {
  const base = `https://wa.me/${WAY_WHATSAPP_E164}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
