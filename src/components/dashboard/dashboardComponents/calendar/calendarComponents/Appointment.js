import React from "react";
import Appointments from "./Appointments";

const Appointment = ({date, message}) => {


    return (
        <>
            <Appointments date={date} message={message}/>
        </>
        
    )
}

export default Appointment