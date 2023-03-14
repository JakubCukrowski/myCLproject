import React, {useEffect, useState} from "react";
import {doc, updateDoc, arrayUnion, collection, onSnapshot, query, where, getDocs} from "@firebase/firestore";
import {db} from "../../../../../firebase/firebase";
import {useAuth} from "../../../../context/AuthContext";
import { Popup } from "../../../../Popup/Popup";
import { useOutletContext } from "react-router-dom";

const Appointments = ({date, weekDay}) => {

    const times = ['08:00','09:30','11:00','12:30','14:00']
    const {user, currentDate} = useAuth()
    const [visitData, setVisitData] = useState([])
    const storedVisits = doc(db, "visits", "ozgzhj0nxfWQIYcs7PUU")
    const visitsCollection = collection(db, "visits")
    const [disabledTimes, setDisabledTimes] = useState([])
    const appointmentDate = date.toLocaleDateString("pl-PL");
    const currentTime = new Date().toLocaleTimeString("pl-PL");
    const [isClicked, setIsClicked] = useState(false)
    const [selectedTime, setSelectedTime] = useState("")
    const [isBlocked, setIsBlocked] = useOutletContext()
    const [successMessage, setSuccessMessage] = useState("")

    const checkIfVisitIsUnavailable = (dateString, time) => {
        return visitData.some(visit => {
            return time === visit.time && dateString === visit.date
        });
    }

    //Block visit if exist

    useEffect(() => {
        const tempDisabledTimes = []
        times.forEach(time => {
            if (checkIfVisitIsUnavailable(date.toLocaleDateString("pl-PL"), time)) {
                tempDisabledTimes.push({
                    time: time, 
                    date: date.toLocaleDateString("pl-PL")})
            }
        })

        setDisabledTimes(tempDisabledTimes)
    }, [visitData])

    //Check for scheduled visits

    useEffect(  () => {
        const unsubscribe = onSnapshot(storedVisits, async (snapshot) => {
            setVisitData(snapshot.data().scheduledVisits)
        })

        return () => unsubscribe()
    }, [])

    //Add visit to firebase

    const updateVisit = async (time) => {
        const userDoc = doc(db, "users", user.uid)
        const visitsQuery = query(visitsCollection, 
            where("date", "==", date.toLocaleDateString("pl-PL"), 
            where("time", "==", time) ))
        const querySnapShot = await getDocs(visitsQuery)

        if (querySnapShot.size === 0) {
            await updateDoc(storedVisits, {scheduledVisits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: time})})

            await updateDoc(userDoc, {visits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: time})})

                    setIsClicked(false)
                    setSuccessMessage("Wizyta zarezerwowana! Do zobaczenia.")
        }
    }

    const showConfirmation = (time) => {
        setIsClicked(true)
        setIsBlocked(true)
        setSelectedTime(time)
    }

    const hideConfirmation = () => {
        setIsClicked(false)
        setIsBlocked(false)
    }


    const disableCloserVisits = (date, time) => {
        date.setHours(parseInt(time.split(":")[0]), parseInt(time.split(":")[1]), 0)
        if (date.toLocaleDateString("pl-PL") === new Date().toLocaleDateString("pl-PL")
        && new Date().getHours() + 1 >= date.getHours()) {
            return true
        }
    }

    const disableSavedVisits = (date, time) => {
        if (disabledTimes.some((data => data.time === time && data.date === date.toLocaleDateString("pl-PL")))) {
            return true
        }
    }

    const handleSuccessMessage = () => {
        setSuccessMessage("")
        setIsBlocked(false)
    }

    return (
        <>
            <div className={"appointment_btn_container"}>
        {weekDay === "Sobota" || weekDay === "Niedziela" 
        ? null
        : 
        times.map((time) => {
            if (appointmentDate === currentDate && currentTime >= time) {
                return null;
            }
            return (
                <button key={time} className={`visit-time-button ${disableCloserVisits(date, time) ? "unavailable" : ""}`}
                    disabled={disableCloserVisits(date, time) || disableSavedVisits(date, time)} 
                    onClick={() => showConfirmation(time)}>
                        {time}
                </button>
            )
        })}
        {isClicked 
                    ? <Popup 
                        date={date.toLocaleDateString("pl-PL")} 
                        weekDay={weekDay} 
                        time={selectedTime} 
                        cancel={hideConfirmation}
                        updateVisit={updateVisit} />
                    : null}            
        </div>
        {successMessage !== "" 
        ? <div className="confirmation-popup">
            <p>{successMessage}</p>
            <button className="ok-btn" onClick={handleSuccessMessage}>OK</button>
            </div> : null}
        </>
    )
}

export default Appointments