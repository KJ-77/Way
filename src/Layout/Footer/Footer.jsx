import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "Components/Container/Container";
import BASE_URL from "Utilities/BASE_URL";

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
        // Reset form on success
        setFormData({
          firstName: "",
          email: "",
          message: "",
        });
      } else {
        setSubmitMessage(
          data.message || "Failed to send message. Please try again."
        );
        setSubmitStatus("error");
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
    <footer className=" py-14">
      <Container className="Container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          {/* 0 */}
          <div className="flex flex-col items-start lg:col-span-2">
            <h2 className="font-bold text-4xl  text-primary lg:mb-4 mb-2 tracking-widest">
              W A Y
            </h2>
            <p className="text-xs my-6">
              To get more information please contact us at:
            </p>
            <div className="flex text-xs items-center gap-2">
              <p>WAY Beirut</p>
              <a className="hover:underline" href="tel:+961(3) 473 410">
                +961(3) 473 410
              </a>
            </div>
            <a
              className="text-xs my-2 hover:underline"
              href="mailto:way@beirut.com"
            >
              way@beirut.com
            </a>
            <div className="flex text-xs items-center gap-2">
              <p>Email:</p>
              <a
                className="hover:underline"
                href="mailto:contactwaybeirut@gmail.com"
              >
                contactwaybeirut@gmail.com
              </a>
            </div>
          </div>
          {/* 1 */}
          <div>
            <p className="text-xl mb-6 ">Stay connected</p>

            <form onSubmit={handleSubmit} className="flex flex-col  gap-3">
              <div className="text-xs flex">
                <label className="flex-1" htmlFor="firstName">
                  First Name
                </label>
                <div className="flex-[2]">
                  <input
                    className="placeholder:text-xs w-3/4  border border-black p-1.5 focus:outline-none focus:border-gray-600 transition-colors"
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Your name here"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="text-xs flex">
                <label className="flex-1" htmlFor="email">
                  Email
                </label>
                <div className="flex-[2]">
                  <input
                    className="placeholder:text-xs w-3/4  border border-black p-1.5 focus:outline-none focus:border-gray-600 transition-colors"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your email here"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="text-xs flex">
                <label className="flex-1" htmlFor="message">
                  Message
                </label>
                <div className="flex-[2]">
                  <textarea
                    className="placeholder:text-xs w-3/4 border border-black min-h-[50px] p-1.5 focus:outline-none focus:border-gray-600 transition-colors resize-vertical"
                    name="message"
                    id="message"
                    rows={2}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your message here"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Status message */}
              {submitMessage && (
                <div className="text-xs flex">
                  <div className="flex-1"></div>
                  <div className="flex-[2]">
                    <div
                      className={`p-2 rounded border text-center ${
                        submitStatus === "success"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}
                    >
                      {submitMessage}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-xs flex">
                <label className="flex-1 opacity-0" htmlFor="submit">
                  Submit
                </label>
                <div className="flex-[2]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`border border-black px-2 py-1 w-1/2 mr-auto transition-all duration-300 ${
                      isSubmitting
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "hover:bg-black hover:text-white"
                    }`}
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* 2 */}
          <div>
            <p className="text-xl mb-6 ">Locate Us</p>

            <ul className="flex flex-col gap-3 text-xs">
              <Link className="hover:underline">Contact us</Link>
              <Link className="hover:underline">Our Location</Link>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 text-gray-400 text-sm text-center">
          <p>
            Copyright © {new Date().getFullYear()} Way Beirut rights reserved.
            Designed by Brand&
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
