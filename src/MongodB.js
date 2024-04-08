import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3002", {
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "http://localhost:3000 http://localhost:57886"
    }
});

const Print_del = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        socket.on('dataBase', (document) => {
            console.log("Received document:", document);
            setDocuments((prevDocuments) => [...prevDocuments, document]);
        });

        return () => {
            socket.off('dataBase');
        };
    }, []);

    const handleDelete = (documentId) => {
        console.log("Deleting document with ID:", documentId);
        socket.emit("delete_id", documentId);
        setDocuments(documents.filter(doc => doc._id !== documentId));
    };

    return (
        <div>
            {documents.map((document, index) => (
                <div key={index} className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <p>{JSON.stringify(document)}</p>
                        <button onClick={() => handleDelete(document._id)}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Print_del;

