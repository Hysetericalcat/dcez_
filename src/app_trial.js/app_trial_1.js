import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3002", {
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:3000"
  }
});

const DynamicForm = ({ onDone }) => {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});

  const handleAddField = () => {
    const newField = `field_${fields.length + 1}`;
    setFields([...fields, newField]);
  };

  const handleRemoveField = (field) => {
    const filteredFields = fields.filter((f) => f !== field);
    setFields(filteredFields);
    const { [field]: removedField, ...restFormData } = formData;
    setFormData(restFormData);
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = () => {
    console.log(formData);
    socket.emit("form_data", formData);
    onDone(formData); // Pass formData to the callback
  };

  return (
    <div>
      <label>
        Enter Fields:
        {fields.map((field) => (
          <div key={field}>
            <input
              type="text"
              placeholder={`Enter ${field}`}
              value={formData[field] || ""}
              onChange={(e) => handleChange(e, field)}
            />
            <button onClick={() => handleRemoveField(field)}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddField}>Add Field</button>
        <button onClick={handleSubmit}>Submit</button>
      </label>
    </div>
  );
};

const Create_Form = () => {
  const [formData, setFormData] = useState(null); // Track form data

  const handleFormDone = (data) => {
    setFormData(data); // Receive form data
  };

  return (
    <div>
      <DynamicForm onDone={handleFormDone} />
      {formData && (
        <div>
          <h2>Submitted Form Data:</h2>
          <ul>
            {Object.entries(formData).map(([fieldName, fieldValue]) => (
              <li key={fieldName}>
                <strong>{fieldName}:</strong> {fieldValue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Create_Form;
