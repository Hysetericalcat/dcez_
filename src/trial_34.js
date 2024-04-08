const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
        allowedHeaders: ['Access-Control-Allow-Origin'] 
    }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("form_data", (data) => {
    console.log("Received form data from client:", data);
    io.emit("form_values", Object.keys(data)); // Emit the received data back to the client
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = process.env.PORT || 3002;
httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

import React, { useState } from "react";
import io from 'socket.io-client';

const socket = io("http://localhost:3002", {
   withCredentials: true,
   extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:3000"
  }
});

const DynamicFieldsForm = ({ setStoredFormData }) => {
  const [labels, setLabels] = useState([]);
  const [labelInput, setLabelInput] = useState("");
  const [labelFormSubmitted, setLabelFormSubmitted] = useState(false);

  const handleAddLabel = () => {
    if (labelInput.trim() !== "") {
      setLabels((prevLabels) => [...prevLabels, labelInput.trim()]);
      setLabelInput("");
    }
  };

  const handleLabelInputChange = (e) => {
    setLabelInput(e.target.value);
  };

  const handleDeleteLabel = (index) => {
    setLabels((prevLabels) => prevLabels.filter((_, i) => i !== index));
  };

  const handleLabelFormSubmit = (e) => {
    e.preventDefault();
    setLabelFormSubmitted(true);
  };

  return (
    <div>
      {!labelFormSubmitted ? (
        <form onSubmit={handleLabelFormSubmit}>
          {labels.map((label, index) => (
            <div key={index}>
              <label>
                {`${label}:`}
                <button type="button" onClick={() => handleDeleteLabel(index)}>
                  Delete
                </button>
              </label>
            </div>
          ))}
          <label>
            Label:
            <input
              type="text"
              value={labelInput}
              onChange={handleLabelInputChange}
            />
          </label>
          <button type="button" onClick={handleAddLabel}>
            Add Label
          </button>
          <button type="submit">Done</button>
        </form>
      ) : (
        <div>
          <h2>Stored Form Data</h2>
          <pre>{JSON.stringify(labels, null, 2)}</pre>
          {setStoredFormData && setStoredFormData(labels)}
        </div>
      )}
    </div>
  );
};

const Createroom = ({ onpress, setonpress }) => {
  const handleFormSubmit = (formData) => {
    console.log("Form Data:", formData);
    socket.emit("send",formData)
    // Here you can send formData to your server or perform any other actions
  };

  if (onpress) {
    return (
      <div>
        <DynamicFieldsForm setStoredFormData={handleFormSubmit} />
      </div>
    );
  }

  return (
    <div>
      <form
        onClick={(e) => {
          e.preventDefault();
          setonpress(true);
        }}
      >
        <button>Create Room</button>
      </form>
    </div>
  );
};

const Form = () => {
  const [onpress, setonpress] = useState(false);
  return (
    <div>
      <Createroom onpress={onpress} setonpress={setonpress} />
    </div>
  );
};

export default Form;
