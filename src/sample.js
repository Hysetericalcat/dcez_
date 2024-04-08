import React, { useState,useEffect} from 'react';
import io from "socket.io-client"
import axios from 'axios';
import Create_room from "./create_room"
import data_recieve from './data.js'
import Join_room from './join_room_1.js'
import Message_Box from "./message.js"
import Message_rev from "./message_recived"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"

const socket = io.connect("http://localhost:3002",{
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:3000 http://localhost:57886"
  }
});


const Disposable_Forms=()=>{
  const[press,setpress]=useState(false)
  const [press_1,setpress_1]=useState(false)

if(press || press_1){
  if(press){
    return(
      <div>
       <Create_room/> 
      </div>
    )
  }
  if(press_1){
   return(
    <div>
      <Join_room />
    </div>
   )
  }}

const Handleclick=()=>{
  setpress(true)
}
const Handleclick_1=()=>{
    setpress_1(true)
}

  return(
    <div class="custom-background">
        <div class="position-absolute top-50 start-50 translate-middle-x">
        <div>
        
        <button onClick={Handleclick} class=" w-100 p-3 h-50 btn btn-outline-primary">Create Room</button>
        </div>
        <br></br>
        <div class="position-relative bottom-50 start-50 translate-middle-x">
  
        <button onClick={Handleclick_1} class=" w-100 p-3 h-50 btn btn-outline-primary">Join Room</button>
        </div>
        </div>
       
     
    </div>
   
  )
}
export default Disposable_Forms

import React, { useState, useEffect } from 'react';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3002", {
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:3000 http://localhost:57886"
  }
});

const Message_case = () => {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    const newInput = e.target.value;
    setInput(newInput);
    // Emit the input value to the server
    socket.emit("message_sent_to_server", newInput);
  }

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("message_collection", (message) => {
      console.log("Received message from server:", message);
      setInput(message);
    });

    // Clean up the socket listener
    return () => {
      socket.off("message_collection");
    };
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <div>
      <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">Message</button>
      <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasRightLabel">Welcome to the chat!</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={handleChange}
          />
          <p>Last Message: {input}</p>
        </div>
      </div>
    </div>
  );
}

export default Message_case;
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { MongoClient } = require('mongodb'); // Import MongoClient

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


io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("room", (room) => {
    console.log("Joined room:", room);
    socket.join(room);
    currentRoom = room;
    socket.emit("room_sent",(currentRoom)=>{
      console.log("Room sent to the user",currentRoom)
    })

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

  socket.on("message", (message) => {
    console.log("Room to send message to:", currentRoom);
    io.to(currentRoom).emit("messageRecived", message);
    console.log(message);
  });

   let message=[]
   socket.on("message sent to the server", (input) => {
    message.push(input);
    console.log(message);
    // Emit message collection event to all sockets or relevant room
    io.emit("message_collection", message); // Change socket.emit to io.emit
});


  /*async function connectAndPrintData(io) {
  
    const dbName = "Disposable_Forms";
    const collectionName = "User_Data";
  
  
    try {
      await client.connect();
     // console.log('Connected successfully to MongoDB');
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      const cursor = collection.find();
      await cursor.forEach(document => {
        socket.emit("dataBase", document);
       // console.log('Emitted document:', document);
      });
    } catch (error) {
      console.error('Error occurred:', error);
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

  })


  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete userData[socket.id];
  });*/

});

app.use(cors());

const PORT = process.env.PORT || 3002;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  import React, { useState,useEffect} from 'react';
import io from "socket.io-client"
import axios from 'axios';
import Create_room from "./create_room"
import data_recieve from './data.js'
import Join_room from './join_room_1.js'
import Message_Box from "./message.js"
import Message_rev from "./message_recived"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"

const socket = io.connect("http://localhost:3002",{
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:3000 http://localhost:57886"
  }
});


const Disposable_Forms=()=>{
  const[press,setpress]=useState(false)
  const [press_1,setpress_1]=useState(false)

if(press || press_1){
  if(press){
    return(
      <div>
       <Create_room/> 
      </div>
    )
  }
  if(press_1){
   return(
    <div>
      <Join_room />
    </div>
   )
  }}

const Handleclick=()=>{
  setpress(true)
}
const Handleclick_1=()=>{
    setpress_1(true)
}

  return(
    <div class="custom-background">
        <div class="position-absolute top-50 start-50 translate-middle-x">
        <div>
        
        <button onClick={Handleclick} class=" w-100 p-3 h-50 btn btn-outline-primary">Create Room</button>
        </div>
        <br></br>
        <div class="position-relative bottom-50 start-50 translate-middle-x">
  
        <button onClick={Handleclick_1} class=" w-100 p-3 h-50 btn btn-outline-primary">Join Room</button>
        </div>
        </div>
       
     
    </div>
   
  )
}
export default Disposable_Forms

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:57886'],
    credentials: true,
    allowedHeaders: ['Access-Control-Allow-Origin']
  }
});

/*const uri = "your-mongodb-uri";
const client = new MongoClient(uri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
});*/

const userData = {}; 

io.on("connection", (socket) => {
  console.log("A user connected");
  
  socket.on("room", (room) => {
    console.log("Joined room:", room);
    socket.join(room);
    currentRoom = room;
    socket.emit("room_sent", currentRoom);
    
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

  socket.on("message", (message) => {
    console.log("Room to send message to:", currentRoom);
    io.to(currentRoom).emit("messageRecived", message);
    console.log(message);
  });

  let message = [];

  socket.on("message sent to the server", (input) => {
    message.push(input);
    console.log(message);
    io.emit("message_collection", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete userData[socket.id];
  });

});

app.use(cors());

const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import React, { useState } from 'react';
import { Button, Toast } from 'react-bootstrap';

function MyComponent() {
  const [showToast, setShowToast] = useState(false); // State to manage Toast visibility

  return (
    <>
      <Button variant="primary" onClick={() => setShowToast(true)}>Show live toast</Button>

      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        {/* Pass 'showToast' state to control the visibility of Toast */}
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <img src="..." className="rounded me-2" alt="..." />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
            {/* Close button should also set 'showToast' state to false */}
            <Button variant="outline-secondary" size="sm" onClick={() => setShowToast(false)}>Close</Button>
          </Toast.Header>
          <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
        </Toast>
      </div>
    </>
  );
}

export default MyComponent;
