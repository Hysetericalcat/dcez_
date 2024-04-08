import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3002', {
  withCredentials: true,
  extraHeaders: {
    'Access-Control-Allow-Origin': 'http://localhost:3000 http://localhost:57886',
  },
}); 

const DataRecieve = () => {
  useEffect(() => {
    socket.on('formDataResponse', (formData) => {
      console.log('Received form data from server:', formData);
    });

    return () => {
      // Clean up if necessary
    };
  }, []);

  return <div>Data receive component</div>;
};

export default DataRecieve;
