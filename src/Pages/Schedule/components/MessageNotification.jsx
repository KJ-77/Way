import React from "react";

const MessageNotification = ({ message }) => {
  if (!message?.text) return null;

  return (
    <div
      className={`max-w-4xl mb-6 p-2.5 rounded-md text-center text-sm ${
        message.type === "success"
          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
          : "bg-rose-50 text-rose-700 border border-rose-100"
      }`}
    >
      <span>{message.text}</span>
    </div>
  );
};

export default MessageNotification;
