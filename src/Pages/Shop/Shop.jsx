import Container from "Components/Container/Container";
import { Link } from "react-router-dom";
import { WhatsappLogo, InstagramLogo, ArrowRight } from "@phosphor-icons/react";
import { buildWhatsAppUrl } from "Utilities/contact";
import { WAY_INSTAGRAM_URL } from "Utilities/socials";

// Placeholder for the shop. The real catalog (products, categories, ordering)
// was removed — this stands in so the "Shop" nav entry has somewhere to land
// instead of being a dead button. Replace this whole file when the shop returns.
const SHOP_ENQUIRY =
  "Hi Way Beirut! I'd like to ask about buying a piece from the studio.";

const Shop = () => (
  <Container className="my-6 sm:my-secondary md:my-primary lg:my-large">
    <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center lg:py-24">
      <span className="mb-6 rounded-full border border-[#5a4434]/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-[#a6826e]">
        Coming soon
      </span>

      <h1 className="text-4xl font-light text-[#5a4434] lg:text-6xl">
        Our <span className="italic">Shop</span>
      </h1>

      <p className="mt-6 text-lg text-[#7a5d4d] lg:text-xl">
        We're putting together a collection of pieces made at the studio — mugs,
        bowls, planters and one-offs from our tutors and members. It'll live
        here soon.
      </p>

      <p className="mt-4 text-base text-[#a6826e]">
        In the meantime, message us if something catches your eye at the studio,
        or follow along on Instagram to see new pieces as they come out of the
        kiln.
      </p>

      <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <a
          href={buildWhatsAppUrl(SHOP_ENQUIRY)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-x-2 rounded-xl bg-[#5a4434] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#7a5d4d]"
        >
          <WhatsappLogo size={18} weight="fill" />
          Ask about a piece
        </a>
        <a
          href={WAY_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-x-2 rounded-xl border border-[#5a4434]/30 px-6 py-3 text-sm font-medium text-[#5a4434] transition-colors duration-300 hover:bg-[#5a4434] hover:text-white"
        >
          <InstagramLogo size={18} weight="fill" />
          Follow on Instagram
        </a>
      </div>

      <Link
        to="/classes"
        className="mt-10 inline-flex items-center gap-x-2 text-sm text-[#a6826e] underline-offset-4 transition-colors duration-200 hover:text-[#5a4434] hover:underline"
      >
        Browse our classes instead
        <ArrowRight size={14} weight="bold" />
      </Link>
    </div>
  </Container>
);

export default Shop;
