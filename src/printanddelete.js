// PrintDeleteData.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3002', {
    withCredentials: true,
    extraHeaders: {
        'Access-Control-Allow-Origin': 'http://localhost:3000 http://localhost:57886',
    },
});
 
const PrintDeleteData = ({ press }) => {
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (press) {
            socket.on('dataBase', (formData) => { // Corrected event name
                setFormData(formData);
            });

            return () => {
                socket.off('dataBase'); // Corrected event name
            };
        }
    }, [press]);

    const handleDelete = () => {
        if (formData && formData._id) {
            socket.emit('dataToDelete', formData._id); // Corrected event name
            setFormData(null);
        }
    };

    return (
        <div>
            {formData && (
                <div>
                    <p>Data: {JSON.stringify(formData)}</p>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
};


export default PrintDeleteData;
