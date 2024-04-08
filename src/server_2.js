const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:57886'],
        credentials: true,
        allowedHeaders: ['Access-Control-Allow-Origin']
    }
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("room", (room) => {
        console.log("Joined room:", room);
        socket.join(room);
    });

    socket.on("form", (formData) => {
        console.log("Data received from the client:", formData);
        socket.emit("formDataResponse",formData);
    });
});

const PORT = process.env.PORT || 3011;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
