import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3002', {
  withCredentials: true,
  extraHeaders: {
    'Access-Control-Allow-Origin': 'http://localhost:3000 http://localhost:57886',
  },
});

const PrintDeleteData = () => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    socket.on('data_print', (formData) => {
      setFormData(formData);
    });

    return () => {
      socket.off('data_print');
    };
  }, []);

  const handleDelete = () => {
    if (formData && formData._id) {
      socket.on("ID", (ID)=>{
        socket.emit('ID_delete',ID) ;
      })
      setFormData(null); // Reset formData after deletion
    }
  };

  return (
    <div>
      {formData && (
        <div>
          <p>Data: {JSON.stringify(formData)}</p> {/* Displaying formData */}
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default PrintDeleteData;
