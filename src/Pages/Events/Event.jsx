import React, { useEffect, useState, useCallback } from "react";
import useInView from "Hooks/useInView";
import useFetch from "Hooks/useFetch";
import usePost from "Hooks/usePost";
import { IMAGE_URL } from "Utilities/BASE_URL";
import { DotsLoader, IsError } from "Components/RequestHandler";
import Container from "Components/Container/Container";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";

const Event = () => {
  const { data, loading, error, fetchData } = useFetch();
  const { loading: sendingRequest, error: requestError, postData } = usePost();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    type: null,
    text: null,
  });

  const getdata = useCallback(async () => {
    await fetchData("/event");
  }, []);

  useEffect(() => {
    getdata();
  }, []);

  // Clear message after 5 seconds
  useEffect(() => {
    if (statusMessage.text) {
      const timer = setTimeout(() => {
        setStatusMessage({ type: null, text: null });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleRequestClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatusMessage({
        type: "error",
        text: "Email is required",
      });
      return;
    }

    if (!phone) {
      setStatusMessage({
        type: "error",
        text: "Phone number is required",
      });
      return;
    }

    try {
      const response = await postData("/event/request", {
        eventId: selectedEvent._id,
        eventTitle: selectedEvent.title,
        email,
        phone,
        message,
      });

      if (response) {
        setRequestSuccess(true);
        setStatusMessage({
          type: "success",
          text: "Your event request has been sent successfully!",
        });
        setTimeout(() => {
          setShowModal(false);
          setRequestSuccess(false);
          setEmail("");
          setPhone("");
          setMessage("");
        }, 3000);
      }
    } catch (err) {
      console.error("Error sending request:", err);
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to send request. Please try again.",
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setEmail("");
    setPhone("");
    setMessage("");
  };

  // Message Notification Component
  const MessageNotification = ({ message }) => {
    if (!message.text) return null;

    return (
      <div
        className={`max-w-4xl mb-6 p-2.5 rounded-md text-center text-sm transition-all duration-300 ${
          message.type === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
            : "bg-rose-50 text-rose-700 border border-rose-100"
        }`}
      >
        <span>{message.text}</span>
      </div>
    );
  };

  // Empty State Component
  const EmptyEventState = () => (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="text-center py-8 px-4 max-w-sm mx-auto">
        <div className="w-12 h-12 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          No Events Available
        </h2>
        <p className="text-gray-500 text-sm">Check back soon for new events</p>
      </div>
    </Container>
  );

  // Event Card Component with Intersection Observer
  const EventCard = ({ event, index }) => {
    // repeat animation on each scroll into view
    const { ref, isInView } = useInView(
      { threshold: 0.15, root: null, rootMargin: "0px 0px -10% 0px" },
      false,
      300
    );

    return (
      <div
        ref={ref}
        className={
          "group   transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform will-change-opacity " +
          (isInView
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-[0.98]")
        }
      >
        {/* Event Card with Background Image */}
        <div
          className={`flex flex-col  gap-x-24 items-center ${
            index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
          }`}
        >
          {/* Gradient Overlay for Text Readability */}
          <div className="lg:flex-[2]">
            <img
              src={`${IMAGE_URL}${event.image}`}
              alt={event.title}
              className="w-full mb-6 lg:mb-0 lg:h-[400px] rounded-2xl lg:rounded-[62px] object-cover"
            />
          </div>

          <h3 className={`text-2xl text-primary mb-2 lg:hidden`}>
            {event.title}
          </h3>

          <div className="lg:flex-1 relative z-10 flex flex-col h-full">
            <div
              className="text-primary  lg:text-xl lg:w-3/4"
              dangerouslySetInnerHTML={{
                __html: event.content,
              }}
            />
            <div className="mt-10 flex flex-wrap items-center gap-x-8">
              <Link
                to="/auth/register"
                className="text-sm underline flex items-center hover:text-secondary transition-colors duration-200"
              >
                Become a member
                <ArrowRightIcon size={14} className="ml-2" />
              </Link>
              <button
                onClick={() => handleRequestClick(event)}
                className="text-sm underline flex items-center hover:text-secondary transition-colors duration-200"
              >
                Book now
                <ArrowRightIcon size={14} className="ml-2" />
              </button>
            </div>
          </div>
        </div>

        <h3
          className={`text-2xl text-primary mt-6 hidden lg:block ${
            index % 2 === 0 ? "text-start" : "text-end"
          }`}
        >
          {event.title}
        </h3>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 min-h-[80vh] items-center justify-center ">
        <DotsLoader />
        <p className="text-xl font-bold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <IsError message={error.message} />
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div>
        <EmptyEventState />
      </div>
    );
  }

  // Only log once after data is loaded
  // console.log(data);

  return (
    <Container className="py-6 sm:py-secondary md:py-primary lg:py-large">
      {/* Message notification */}
      <MessageNotification message={statusMessage} />

      <div className="">
        <div className="">
          <h2 className="text-primary text-3xl lg:text-5xl mb-6 lg:mb-12">
            Be part of the events at{" "}
            <span className="italic text-secondary"> Way</span>
          </h2>
        </div>

        {/* Events Grid Layout */}
        <div className="flex flex-col gap-12 lg:gap-44">
          {data.data.map((event, index) => (
            <EventCard key={event._id} event={event} index={index} />
          ))}
        </div>
      </div>

      {/* Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 sm:p-8 max-w-sm sm:max-w-md w-full mx-4 shadow-2xl">
            {requestSuccess ? (
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Request Sent Successfully!
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-6 text-gray-900">
                  Request Event: {selectedEvent?.title}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-medium mb-2"
                      htmlFor="email"
                    >
                      Your Email*
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-medium mb-2"
                      htmlFor="phone"
                    >
                      Phone Number*
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      pattern="[+0-9\-()\s]{6,}"
                      placeholder="e.g. +1 555 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Include country code if outside your region.
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-medium mb-2"
                      htmlFor="message"
                    >
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 h-32 resize-none"
                      placeholder="Tell us more about your event requirements..."
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                        sendingRequest ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={sendingRequest}
                    >
                      {sendingRequest ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send Request"
                      )}
                    </button>
                  </div>
                  {requestError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-700 text-sm">
                        Error: {requestError.message}
                      </p>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

export default Event;
