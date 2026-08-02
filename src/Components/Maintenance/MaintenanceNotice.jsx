import { Phone, EnvelopeSimple } from "@phosphor-icons/react";
import whiteLogo from "assets/white-logo.webp";
import backdrop from "assets/images/landing/hero-1.webp";
import "./MaintenanceNotice.css";

// Studio contact details, mirrored from the site footer so visitors still have
// a way to reach WAY while the site itself is down.
const PHONE_DISPLAY = "+961 76 717 406";
const PHONE_HREF = "tel:+96176717406"; // tel: links must be digits only, no spaces
const EMAIL = "contactwaybeirut@gmail.com";

// Note on colour: #dcb5a6 below is a lighter tint of the brand clay (#b77f6e).
// The brand shade only reaches ~3.8:1 against this dark wash — fine for large
// display type, but it fails WCAG AA on small label text, so anything small or
// interactive uses the tint (~6.8:1) instead. Written as a literal in each class
// rather than a shared constant because Tailwind scans source statically and
// would never emit CSS for an interpolated class name.

const MaintenanceNotice = () => {
  return (
    // .maintenance-screen = 100vh with a 100svh override; see the CSS file for
    // why this can't be expressed with Tailwind utilities.
    <main className="maintenance-screen relative w-full overflow-hidden bg-primary">
      {/* Backdrop: a studio photo pushed far back behind a heavy brand wash, so
          the copy stays legible no matter how the image crops at a given size. */}
      <img
        src={backdrop}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-primary/[0.88]" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-transparent to-primary opacity-70" />

      {/* Soft clay-toned glow centred behind the wordmark. */}
      <div
        aria-hidden="true"
        className="maintenance-ember pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-[60%] rounded-full bg-secondary/25 blur-[120px]"
      />

      {/* Tighter vertical rhythm on small screens so the whole notice clears a
          667px-tall phone viewport without scrolling. */}
      <div className="maintenance-screen relative z-10 flex flex-col items-center justify-center px-6 py-12 text-center text-white md:py-16">
        {/* Wordmark */}
        <div className="maintenance-rise maintenance-rise-1">
          <img
            src={whiteLogo}
            alt="Way Beirut"
            width={140}
            height={140}
            className="h-[104px] w-[104px] object-contain md:h-[140px] md:w-[140px]"
          />
        </div>

        {/* Headline */}
        <div className="maintenance-rise maintenance-rise-2 mt-10 md:mt-12">
          <p className="century text-[0.7rem] uppercase tracking-[0.45em] text-[#dcb5a6] md:text-xs">
            Way Beirut
          </p>
          <h1 className="title mt-5 text-4xl leading-[1.1] tracking-wide sm:text-5xl md:text-7xl">
            Under Maintenance
          </h1>
        </div>

        {/* Body copy */}
        <div className="maintenance-rise maintenance-rise-3 mt-8 max-w-xl">
          <div className="mx-auto mb-8 h-px w-16 bg-secondary/60" />
          <p className="century text-sm leading-relaxed text-white/80 sm:text-base">
            Our website is currently offline while we shape something new.
            We&rsquo;re working on it now and will be back very soon &mdash;
            thank you for your patience.
          </p>
        </div>

        {/* Contact — the one thing a maintenance page must not drop. */}
        <div className="maintenance-rise maintenance-rise-4 mt-12 w-full max-w-xl">
          <p className="century text-[0.65rem] uppercase tracking-[0.3em] text-white/60">
            In the meantime, reach us at
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10">
            <a
              href={PHONE_HREF}
              className="century group flex items-center gap-2.5 text-sm text-white/85 transition-colors duration-300 hover:text-[#dcb5a6]"
            >
              <Phone
                size={18}
                weight="light"
                className="text-[#dcb5a6] transition-transform duration-300 group-hover:scale-110"
              />
              <span className="border-b border-transparent pb-0.5 transition-colors duration-300 group-hover:border-[#dcb5a6]">
                {PHONE_DISPLAY}
              </span>
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="century group flex items-center gap-2.5 text-sm text-white/85 transition-colors duration-300 hover:text-[#dcb5a6]"
            >
              <EnvelopeSimple
                size={18}
                weight="light"
                className="text-[#dcb5a6] transition-transform duration-300 group-hover:scale-110"
              />
              <span className="break-all border-b border-transparent pb-0.5 transition-colors duration-300 group-hover:border-[#dcb5a6]">
                {EMAIL}
              </span>
            </a>
          </div>
        </div>

        <p className="century maintenance-rise maintenance-rise-4 mt-10 text-[0.65rem] tracking-[0.2em] text-white/50 md:mt-16">
          &copy; {new Date().getFullYear()} WAY BEIRUT
        </p>
      </div>
    </main>
  );
};

export default MaintenanceNotice;
