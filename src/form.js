import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3002", {
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:3000"
  }
});

const FormComponent = () => {
  const [formData, setFormData] = useState({});
  const [receivedFields, setReceivedFields] = useState([]);
  

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = () => {
    // Emit the form data to the server
    console.log("Form data to be sent:", formData);
    socket.emit("form_data", formData);
  };

  return (
    <div>
      <h2>Fill in the Form</h2>
      <form>
        {receivedFields.map((field, index) => (
          <div key={index}>
            <label htmlFor={field}>{field}:</label>
            <input
              type="text"
              id={field}
              value={formData[field] || ''}
              onChange={(e) => handleChange(e, field)}
            />
          </div>
        ))}
        <button type="button" onClick={handleSubmit}>Submit Form</button>
      </form>
    </div>
  );
};

export default FormComponent;
