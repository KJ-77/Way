import React, { useState, useEffect } from "react";
import Container from "Components/Container/Container";
import { WhatsappLogo, InstagramLogo } from "@phosphor-icons/react";
import BASE_URL, { MOCK_MODE } from "Utilities/BASE_URL";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState(""); // 'success' or 'error'

  // Auto-hide success message after 2 seconds
  useEffect(() => {
    if (submitStatus === "success" && submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage("");
        setSubmitStatus("");
      }, 2000);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.firstName.trim()) {
      setSubmitMessage("Please enter your first name");
      setSubmitStatus("error");
      return;
    }
    if (!formData.email.trim()) {
      setSubmitMessage("Please enter your email address");
      setSubmitStatus("error");
      return;
    }
    if (!formData.message.trim()) {
      setSubmitMessage("Please enter a message");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitStatus("");

    try {
      if (MOCK_MODE) {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 600));
        setSubmitMessage("Thank you! Your message has been received.");
        setSubmitStatus("success");
        setFormData({ firstName: "", email: "", message: "" });
      } else {
        const response = await fetch(`${BASE_URL}/api/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSubmitMessage(data.message);
          setSubmitStatus("success");
          setFormData({ firstName: "", email: "", message: "" });
        } else {
          setSubmitMessage(
            data.message || "Failed to send message. Please try again."
          );
          setSubmitStatus("error");
        }
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitMessage(
        "Network error. Please check your connection and try again."
      );
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-primary/10 py-10 text-primary">
      <Container className="Container">
        {/* Two columns from md up: identity + contact on the left, the
            newsletter form on the right. Everything stacks on mobile. */}
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

          {/* Newsletter / contact form */}
          <div>
            <p className="text-lg font-medium">Subscribe to newsletter</p>

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
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm" htmlFor="footer-email">
                    Email
                  </label>
                  <input
                    className={FIELD_CLASSES}
                    type="email"
                    id="footer-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
                className={`rounded-md border border-primary px-6 py-2 text-sm font-medium transition-all duration-300 ${
                  isSubmitting
                    ? "cursor-not-allowed bg-gray-100 text-gray-500"
                    : "hover:bg-primary hover:text-white"
                }`}
              >
                {isSubmitting ? "Sending..." : "Submit"}
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
