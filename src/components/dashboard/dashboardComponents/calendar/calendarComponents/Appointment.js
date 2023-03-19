import React from "react";
import Appointments from "./Appointments";

const Appointment = ({date, weekDay, visitType}) => {


    return (
        <>
            <Appointments date={date} weekDay={weekDay} visitType={visitType}/>
        </>
        
    )
}

export default Appointment