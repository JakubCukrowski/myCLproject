import { faArrowDown, faChevronDown, faChevronUp, faCircleArrowLeft, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from "react";
import Appointment from "./calendarComponents/Appointments";

const MyCalendar = () => {
    const [date, setDate] = useState(new Date())
    const days = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"]
    const weekDays = []
    const [windowSize, setWindowSize] = useState(window.innerWidth)
    const [showDays, setShowDays] = useState(7)
    const [selectedVisitType, setSelectedVisitType] = useState("Wybierz rodzaj wizyty")
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setWindowSize(window.innerWidth) 
            if (window.innerWidth > 1150) {
                setShowDays(7)
            }
            
            if (window.innerWidth <= 1150) {
                setShowDays(6)
            } 
            
            if (window.innerWidth <= 1000) {
                setShowDays(4)
            }

            if (window.innerWidth <= 750) {
                setShowDays(3)
            }

            if (window.innerWidth <= 580) {
                setShowDays(2)
            }
            
        }

        handleResize()
        
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const prevDays = () => {
        setDate(prev => {
            const newDate = new Date(prev)
            newDate.setDate(prev.getDate() - showDays)

            return newDate
        })
    }

    const nextDays = () => {
        setDate(prev => {
            const newDate = new Date(prev)
            newDate.setDate(prev.getDate() + showDays)

            return newDate
        })
    }

    for (let i = 0; i < showDays; i++) {
        const currDate = new Date(date)
        currDate.setDate(date.getDate() + i);
        weekDays.push(currDate)
    }

    const handleDropdown = () => {
        setIsOpen(prev => !prev)
    }

    const handleType = (e) => {
        setSelectedVisitType(e.target.innerText)
        setIsOpen(false)
    }

    return (
        <>
            <h2>Umów się na wizytę</h2>
            <div className="dropdown">
                <div className="dropdown-label" onClick={handleDropdown}>
                    <p>{selectedVisitType}</p>
                    <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown}/>
                </div>
                <div className={`dropdown-options ${isOpen ? "visible" : ""}`} onClick={handleType}>
                    <p>Konsultacja psychologiczna dla osób dorosłych</p>
                    <p>Konsultacja psychologiczna dla dzieci i młodzieży</p>
                    <p>Konsultacja dla par</p>
                </div>
            </div>
            {selectedVisitType !== "Wybierz rodzaj wizyty" 
            ? <div className="date-wrapper">
            <button disabled={date <= new Date()} onClick={prevDays}>
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
                <Appointment currDay={day} visitType={selectedVisitType} weekDay={days[day.getDay()]}/>
            </div>)}
            <button onClick={nextDays}>
                <FontAwesomeIcon icon={faCircleArrowRight} fontSize={30}/>
            </button>
        </div> 
        : null}
        </>
    )
}

export default MyCalendar