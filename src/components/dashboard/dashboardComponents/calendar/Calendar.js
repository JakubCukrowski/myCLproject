import React, {useState} from 'react';
import Calendar from 'react-calendar';
import Appointment from "./calendarComponents/Appointment";

const MyCalendar = () => {
    const [date, setDate] = useState(new Date())
    const [visit, setVisit] = useState(false)

    const disable = ({date}) => {
        return date.getDay() === 0 || date.getDay() === 6
    }

    return (
        <>
            <div className="calendar-container">
                <h2 className="header">Zaplanuj wizytę</h2>
                <Calendar
                    onChange={setDate}
                    tileDisabled={disable}
                    tileClassName={"tile-content"}
                    value={date}
                    view={"month"}
                    locale={"pl-PL"}
                    minDate={new Date()}
                    maxDate={new Date("2023-12-31")}
                    onClickDay={() => setVisit(true)}/>
            </div>
            <div>
                <p>{visit ? `Dostępne wizyty w dniu ${date.toLocaleDateString("pl-PL")}` : null}</p>
                <Appointment visitDate={visit} date={date}/>
            </div>
        </>
    )

}

export default MyCalendar;