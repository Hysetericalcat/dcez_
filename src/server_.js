const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb'); // Import ObjectId

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:57886'],
    credentials: true,
    allowedHeaders: ['Access-Control-Allow-Origin']
  }
});

const uri = "mongodb+srv://akshat124b:Akshat%403624@cluster0.klwjwuh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
});

const userData = {}; 
let currentRoom;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("room", (room) => {
    console.log("Joined room:", room);
    socket.join(room);
    currentRoom = room;
    socket.emit("room_sent", currentRoom); // Send the current room to the user

    if (Object.values(userData).some(data => data.room === currentRoom)) {
        const userDataForRoom = Object.values(userData).filter(data => data.room === currentRoom);
        io.to(currentRoom).emit("user_data", userDataForRoom);
    } else {
        socket.emit("room_not_found");
    }
});

socket.on("form", (formData) => {
    console.log("Data received from the client:", formData);
    socket.emit("formDataResponse", formData);

    userData[socket.id] = {
        room: currentRoom,
        data: formData
    };

    io.to(currentRoom).emit("user_data", Object.values(userData));
    console.log("Updated userData:", userData);
});

let message_array = [];

socket.on("message_sending", (msg) => {
    console.log("message received from the user", msg);
    message_array.push(msg);
    io.emit('chat message', message_array); // Emit the message array directly
    console.log("message sent:", message_array);
});

  // Avoid disconnecting the socket here
  // Avoid disconnecting the socket here
  // Debugging code for database connection and operations
  /*async function connectAndPrintData(io) {
    const dbName = "Disposable_Forms";
    const collectionName = "User_Data";

    try {
      await client.connect();
      console.log('Connected successfully to MongoDB');
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      const cursor = collection.find();
      await cursor.forEach(document => {
        socket.emit("dataBase", document);
        console.log('Emitted document:', document);
      });
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  }
  connectAndPrintData(io);

  io.on("delete_id",(documentId)=>{
    async function deleteDocumentById(documentId) {
      const client = new MongoClient(uri);
    
      try {
        await client.connect();
        console.log('Connected successfully to MongoDB');
    
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
    
        const result = await collection.deleteOne({ _id: ObjectId(documentId) });
    
        if (result.deletedCount === 1) {
          console.log('Document deleted successfully.');
        } else {
          console.log('Document not found or already deleted.');
        }
      } catch (error) {
        console.error('Error occurred:', error);
      } finally {
        await client.close();
        console.log('MongoDB connection closed.');
      }
    }
    deleteDocumentById(documentId);
  });*/

});

app.use(express.static('public'));
app.use(cors());

const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
