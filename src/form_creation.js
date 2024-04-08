import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from "axios"
import Print_del from "./MongodB"
import  ChatApp from "./message_print" 

const socket = io.connect("http://localhost:3002", {
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "http://localhost:3000 http://localhost:57886"
    }
});

const ResponseForm = ({ responseData }) => {
    const [formData, setFormData] = useState({});
    const [documents, setDocuments] = useState([]);
    const [push, setPush] = useState(false);

    useEffect(() => {
        const handleDataBase = (document) => {
            setDocuments((prevDocuments) => [...prevDocuments, document]);
        };

        socket.on('dataBase', handleDataBase);

        return () => {
            socket.off('dataBase', handleDataBase);
        };
    }, []);

    const Handleclick = (e) => {
        e.preventDefault();
        setPush(true);
        console.log('Form Data:', formData);
    };

    const handleChange = (e, fieldName) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    if (push) {
         
        return(
         <div>
        <h1>User Date</h1>    
        <Print_del />
        </div>   )
        
    }

    return (
        <form>
            {responseData && Object.keys(responseData).map((key) => (
                <div key={key}>
                    <label htmlFor={responseData[key].fieldName}>{responseData[key].fieldName}</label>
                    <input
                        type="text"
                        id={responseData[key].fieldName}
                        name={responseData[key].fieldName}
                        value={formData[responseData[key].fieldName] || ''}
                        onChange={(e) => handleChange(e, responseData[key].fieldName)}
                    />
                </div>
            ))}
            <button onClick={Handleclick}>Submit</button>
            < ChatApp/>
        </form>
    );
    
};

export default ResponseForm;
