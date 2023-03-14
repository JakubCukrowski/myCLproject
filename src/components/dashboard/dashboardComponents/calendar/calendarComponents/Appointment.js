import React from "react";
import Appointments from "./Appointments";

const Appointment = ({date, weekDay}) => {


    return (
        <>
            <Appointments date={date} weekDay={weekDay}/>
        </>
        
    )
}

export default Appointment