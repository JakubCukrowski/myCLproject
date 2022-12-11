import React, {useState} from 'react';
import Calendar from 'react-calendar';
import Appointment from "./calendarComponents/Appointment";

const MyCalendar = () => {
    const [date, setDate] = useState(new Date())
    const [visit, setVisit] = useState(false)

    const disabled = ({date}) => date.getDay() === 0 || date.getDay() === 6

    return (
        <>
            <h2 className="header">Zaplanuj wizytę</h2>
            <div className="calendar-container">
                <Calendar
                    onChange={setDate}
                    tileDisabled={disabled}
                    tileClassName={"tile-content"}
                    value={date}
                    locale={"pl-PL"}
                    minDate={new Date()}
                    maxDate={new Date("2023-12-31")}
                    onClickDay={() => setVisit(true)}/>
            </div>
            <div>
                <p>Dostępne wizyty w dniu {date.toLocaleDateString("pl-PL")}</p>
                <Appointment visitDate={visit} date={date}/>
            </div>
        </>
    )

}

export default MyCalendar;