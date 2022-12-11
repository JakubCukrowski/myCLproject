import React from "react";

const AppointmentBtn = ({onClick, title, disabled}) => {

    return (
        <button disabled={disabled} onClick={onClick} className="appointment-btn">{title}</button>
    )
}

export default AppointmentBtn