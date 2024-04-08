import React, { useState, useEffect } from 'react';
import io from "socket.io-client"
import axios from 'axios';
import Create_room from "./create_room"
import data_recieve from './data.js'
import Join_room from './join_room_1.js'
import Message_Box from "./message.js"
import Message_rev from "./message_recived"
import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const socket = io.connect("http://localhost:3002",{
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:3000 http://localhost:57886"
  }
});

const Disposable_Forms = () => {
  const [press, setpress] = useState(false)
  const [press_1, setpress_1] = useState(false)

  if (press || press_1) {
    if (press) {
      return (
        <div>
          <Create_room/>
        </div>
      )
    }
    if (press_1) {
      return (
        <div>
          <Join_room />
        </div>
      )
    }
  }

  const Handleclick = () => {
    setpress(true)
  }
  
  const Handleclick_1 = () => {
    setpress_1(true)
  }

  return (
    <div>
      <nav className="navbar navbar-white bg-white" style={{ marginTop: '0px',height:'50px' }}>
        <div className="container">
          <span className="navbar-brand mb-0 h1  pos5 fw-bolder fs-4 " style={{left:'100px' }}>Disposable Forms</span>
        </div>
      </nav>
      <img src="/Users/chromeblood/Desktop/roor.jpeg" alt="Background" className="left-image"/>
      <div style={{backgroundColor: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div>
          <label>
            <div className="card rounded-4" style={{width: "25rem",height: "25rem"}}>
              <button className="button pos2 rounded-4 fw-bolder" onClick={Handleclick}>
                Create room
              </button>
              <br/>
              <br/>
              <button className="button pos3 rounded-4 fw-bolder " onClick={Handleclick_1}>
                Join Room
              </button>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

export default Disposable_Forms
