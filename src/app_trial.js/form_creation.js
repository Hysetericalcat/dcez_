import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3002');

function Application() {
  const [room, setRoom] = useState('');
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    socket.on('dataFromServer', (data) => {
      console.log('Data received from server:', data);
      setFields(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Handle form submission, e.g., send data to server
  };

  return (
    <div>
      <h2>Form for Room: {room}</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <div key={index}>
            <label>
              {field}:
              <input
                type="text"
                value={formData[field] || ''}
                onChange={(e) => handleChange(e, field)}
              />
            </label>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Application;
