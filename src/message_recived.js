import React, { useState, useEffect } from 'react';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3002", {
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "http://localhost:3000 http://localhost:57886"
    }
});

const Message_Rev = () => {
    const [receivedMessage, setReceivedMessage] = useState("");

    useEffect(() => {
        socket.on("messageRecived", (message) => {
            setReceivedMessage(message);
        });

        // Clean up the socket listener when component unmounts
        return () => {
            socket.off("messageRecived");
        };
    }, []);

    return (
        <div>
            <h2>Received Message:</h2>
            <p>{receivedMessage}</p>
        </div>
    );
};

export default Message_Rev;
