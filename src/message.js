// Message_Box.js
import React, { useState } from 'react';
import io from "socket.io-client";
import Message_rev from "./message_recived"

const socket = io.connect("http://localhost:3002", {
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:3000 http://localhost:57886"
  }
});

const Message_Box = () => {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClick = () => {
    socket.emit("message", message);
   
  };

  return (
    <div>
      <label>
        <input
          type="text"
          placeholder=""
          value={message}
          onChange={handleChange}
        />
      </label>
      <button onClick={handleClick}>Send Message</button>
      < Message_rev/>
    </div>
  );
};

export default Message_Box;
