import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3002");

const YourComponent = () => {
    const [printedForm, setPrintedForm] = useState(null);

    useEffect(() => {
        socket.on("sendform", (formData) => {
            console.log('Received form data:', formData);
            const formFields = Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                    <label>{key}</label>
                    <input type="text" value={value} readOnly />
                </div>
            ));

            const formComponent = (
                <form>
                    {formFields}
                </form>
            );

            setPrintedForm(formComponent);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Printed Form</h1>
            {printedForm}
        </div>
    );
};

export default YourComponent;
