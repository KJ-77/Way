import React, { useState, useEffect } from "react";
import Container from "Components/Container/Container";
import { WhatsappLogo, InstagramLogo } from "@phosphor-icons/react";
import { buildWhatsAppUrl, WAY_WHATSAPP_DISPLAY } from "Utilities/contact";
import { WAY_INSTAGRAM_URL } from "Utilities/socials";

// Google Maps short link to the studio's actual pin.
const WAY_MAPS_URL = "https://maps.app.goo.gl/UVAai3yZXm8498gj8";

// Compact pill used for the two social channels. Icon + label so it reads as a
// button rather than a bare glyph.
const SocialButton = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-x-2 rounded-full border border-primary/25 px-4 py-2 text-sm font-medium text-primary transition-colors duration-300 hover:bg-primary hover:text-white"
  >
    <Icon size={18} weight="fill" />
    {label}
  </a>
);

const FIELD_CLASSES =
  "w-full rounded-md border border-primary/30 bg-transparent px-3 py-2 text-sm text-primary placeholder:text-primary/40 transition-colors focus:border-primary focus:outline-none disabled:opacity-60";

const Footer = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    message: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState(""); // 'success' or 'error'

  // Auto-hide the success note after a few seconds
  useEffect(() => {
    if (submitStatus === "success" && submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage("");
        setSubmitStatus("");
      }, 5000);

      // Cleanup timer if component unmounts or status changes
      return () => clearTimeout(timer);
    }
  }, [submitStatus, submitMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any previous messages when user starts typing
    if (submitMessage) {
      setSubmitMessage("");
      setSubmitStatus("");
    }
  };

  // Hands the message to the studio's WhatsApp. There's no contact/newsletter
  // backend: until 2026-09-28 this form showed "Thank you! Your message has been
  // received." and sent nothing anywhere — every enquiry was silently lost.
  // WhatsApp is where the studio already answers people, and the sender's number
  // comes with the chat, so email is optional here.
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.firstName.trim()) {
      setSubmitMessage("Please enter your first name");
      setSubmitStatus("error");
      return;
    }
    if (!formData.message.trim()) {
      setSubmitMessage("Please enter a message");
      setSubmitStatus("error");
      return;
    }

    const lines = [
      `Hi Way! I'm ${formData.firstName.trim()}.`,
      "",
      formData.message.trim(),
      ...(formData.email.trim() ? ["", `Email: ${formData.email.trim()}`] : []),
    ];
    const url = buildWhatsAppUrl(lines.join("\n"));

    // Opened synchronously inside the submit, so it counts as the user's own click
    // and popup blockers let it through. If one still blocks it, go there in this
    // tab instead (on phones wa.me hands straight over to the WhatsApp app anyway).
    const tab = window.open(url, "_blank");
    if (tab) {
      tab.opener = null; // the opened page gets no handle on this site
    } else {
      window.location.href = url;
      return;
    }

    setSubmitMessage("WhatsApp is open with your message — press Send there and we'll get back to you.");
    setSubmitStatus("success");
    setFormData({ firstName: "", email: "", message: "" });
  };

  return (
    <footer className="border-t border-primary/10 py-10 text-primary">
      <Container className="Container">
        {/* Two columns from md up: identity + contact on the left, the
            message form on the right. Everything stacks on mobile. */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          {/* Identity, contact channels, socials */}
          <div>
            <h2 className="title text-3xl font-bold tracking-widest text-primary">
              W A Y
            </h2>

            <div className="mt-4 space-y-1 text-sm">
              <p className="font-medium">WAY Beirut</p>
              <p>
                <a className="hover:underline" href={`tel:${WAY_WHATSAPP_DISPLAY.replace(/\s/g, "")}`}>
                  {WAY_WHATSAPP_DISPLAY}
                </a>
              </p>
              <p>
                <a className="hover:underline" href="mailto:way@beirut.com">
                  way@beirut.com
                </a>
              </p>
              <p>
                <a
                  className="hover:underline"
                  href="mailto:contactwaybeirut@gmail.com"
                >
                  contactwaybeirut@gmail.com
                </a>
              </p>
              <p>
                <a
                  className="hover:underline"
                  href={WAY_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rue du Liban, Beirut
                </a>
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <SocialButton
                href={buildWhatsAppUrl()}
                icon={WhatsappLogo}
                label="WhatsApp"
              />
              <SocialButton
                href={WAY_INSTAGRAM_URL}
                icon={InstagramLogo}
                label="Instagram"
              />
            </div>
          </div>

          {/* Contact form — hands off to WhatsApp (see handleSubmit) */}
          <div>
            <p className="text-lg font-medium">Send us a message</p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    className="mb-1 block text-sm"
                    htmlFor="footer-firstName"
                  >
                    First Name
                  </label>
                  <input
                    className={FIELD_CLASSES}
                    type="text"
                    id="footer-firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm" htmlFor="footer-email">
                    Email (optional)
                  </label>
                  <input
                    className={FIELD_CLASSES}
                    type="email"
                    id="footer-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm" htmlFor="footer-message">
                  Message
                </label>
                <textarea
                  className={`${FIELD_CLASSES} min-h-[70px] resize-y`}
                  name="message"
                  id="footer-message"
                  rows={2}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message here"
                />
              </div>

              {/* Status message */}
              {submitMessage && (
                <div
                  className={`rounded-md border p-2 text-center text-sm ${
                    submitStatus === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-x-2 rounded-md border border-primary px-6 py-2 text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white"
              >
                <WhatsappLogo size={18} weight="fill" />
                Send on WhatsApp
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-primary/10 pt-5 text-center text-sm text-primary/60">
          <p>
            Copyright © {new Date().getFullYear()} Way Beirut rights reserved.
            Designed by Brand&amp;
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
