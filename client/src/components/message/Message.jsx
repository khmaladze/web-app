import React from "react";
import "./message.css";
import { format } from "timeago.js";

export default function Message({ message, own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="http://res.cloudinary.com/dtlhyd02w/image/upload/v1638285901/liyyrl5tlta51xsuebji.jpg"
          alt=""
        />
        <p className="messageText">{message.text} </p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
