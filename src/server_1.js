const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:57886', 'http://localhost:3002'],
        credentials: true,
        allowedHeaders: ['Access-Control-Allow-Origin']
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on("senData", (formData) => {
        console.log('Received form data:', formData);
        socket.emit('response', { message: 'Form data received successfully' });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3003;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
