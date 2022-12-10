import React from "react";
import Appointments from "./Appointments";

const Appointment = ({visitDate, date}) => {

    return (
        <div>
            {visitDate ? <Appointments date={date}/> : null}
        </div>
    )
}

export default Appointment