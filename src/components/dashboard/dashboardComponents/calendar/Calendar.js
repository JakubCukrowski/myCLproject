import { faCircleArrowLeft, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useState} from "react";
import Appointment from "./calendarComponents/Appointments";

const MyCalendar = () => {
    const [date, setDate] = useState(new Date())
    const days = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"]
    const weekDays = []

    const prevDay = () => {
        setDate(prev => {
            const newDate = new Date(prev)
            newDate.setDate(prev.getDate() - 7)

            return newDate
        })
    }

    const NextDay = () => {
        setDate(prev => {
            const newDate = new Date(prev)
            newDate.setDate(prev.getDate() + 7)

            return newDate
        })
    }

    for (let i = 0; i < days.length; i++) {
        const currDate = new Date(date)
        currDate.setDate(date.getDate() + i);
        weekDays.push(currDate)
    }

    return (
        <>
            <h2>Umów się na wizytę</h2>
            <div className="date-wrapper">
            <button disabled={date <= new Date()} onClick={prevDay}>
                <FontAwesomeIcon icon={faCircleArrowLeft} fontSize={30}/>
            </button>
                {weekDays.map((day, index) => 
                <div key={index}>
                    <div className="date-content">
                        <p>
                            {days[day.getDay()]} 
                        </p>
                        <p>
                            {day.toLocaleDateString("pl-PL")}
                        </p>
                    </div>
                    <Appointment date={day} message={days[day.getDay()]}/>
                </div>)}
                <button onClick={NextDay}>
                    <FontAwesomeIcon icon={faCircleArrowRight} fontSize={30}/>
                </button>
            </div> 
        </>
    )
}

export default MyCalendar