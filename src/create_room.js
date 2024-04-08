import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ResponseForm from './form_creation';
import Message_Rev from "./message_recived"
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import "./App.css"

const socket = io.connect("http://localhost:3002", {
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "http://localhost:3000 http://localhost:57886"
    }
});

const CreateRoom = () => {
    const [press, setPress] = useState(false);
    const [value, setValue] = useState('');
    const [push, setPush] = useState(false);
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        // Generate random code when component mounts
        const generateSixDigitCode = () => {
            const randomNumber = Math.floor(Math.random() * 900000) + 100000;
            setValue(randomNumber.toString()); // Convert to string before setting
        };
        generateSixDigitCode();
    }, []); // Empty dependency array ensures this runs only once

    useEffect(() => {
        if (push) {
            socket.on('formDataResponse', (responseData) => {
                console.log('Data received from server:', responseData);
                setResponseData(responseData);
            });

            return () => {
                socket.off('formDataResponse');
            };
        }
    }, [push]);

    const DynamicForm = () => {
        const [fields, setFields] = useState([]);
        const [formData, setFormData] = useState({});

        const addField = () => {
            const newFields = [...fields, { id: Date.now() }];
            setFields(newFields);
        };

        const removeField = (id) => {
            const updatedFields = fields.filter((field) => field.id !== id);
            setFields(updatedFields);
        };

        const handleChange = (e, id) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [id]: {
                    ...prevData[id],
                    [name]: value,
                },
            }));
        };
        if(push){
          return(
            <div>
             {push && responseData && <ResponseForm responseData={responseData} />}
            </div>  
          )
         }

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Form Data:', formData);
            // Emit formData only if it's an object
            if (typeof formData === 'object') {
                socket.emit('form', formData);
                setPush(true);
            } else {
                console.error('Invalid formData');
            }
        };

        return (
            <div>
                <form onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.id}>
                            <input
                                type="text"
                                name="fieldName"
                                placeholder="Field Name"
                                onChange={(e) => handleChange(e, field.id)}
                            />

                            <button type="button"  onClick={() => removeField(field.id)}>
                                < DeleteIcon/>
                                <br></br>
                            </button>
                           
                        </div>
                    ))}
                      <br></br>
                    <button type="button" onClick={addField}>
                       <AddIcon/>
                    </button>
                    <br></br>
                    <br></br>
                    <div className="row">
                    <div className='col s12'>
                    <div className="center-align">
                    <button type="submit"><DoneIcon /></button>
                    </div>
                    </div>
                    </div>
                </form>
            </div>
        );
    };

    const handleClick = () => {
      setPress(true);
      console.log(value)
      socket.emit('room', value);
      socket.emit('message_room',value)
     };

    if(press){
      return(
        <div>
        <DynamicForm/>
        </div>
      )
    }

    return (
      <div>
       <div className="center-align">
       <div className="row">
        <div className="col s12">
      <label>
      <div className='pos' style={{backgroundImage: `url('/Users/chromeblood/Desktop/full_moon.jpeg')`}}>
          <h1> Room Code</h1>
          <br></br>
           <h2>{value}</h2> 
           </div>

      </label>
      <button onClick={handleClick}> <div className='btn-large purple darken-1'>Submit</div></button>
      </div> 
      </div>
        </div>
        </div>
)}

export default CreateRoom;