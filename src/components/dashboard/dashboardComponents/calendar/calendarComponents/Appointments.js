import React, {useEffect, useState} from "react";
import {doc, updateDoc, arrayUnion, collection, onSnapshot, query, where, getDocs, arrayRemove} from "@firebase/firestore";
import {db} from "../../../../../firebase/firebase";
import {useAuth} from "../../../../context/AuthContext";
import { Popup } from "../../../../Popup/Popup";
import { useOutletContext } from "react-router-dom";

const Appointments = ({currDay, weekDay, visitType}) => {

    const times = ['08:00','09:30','11:00','12:30','14:00']
    const {user, currentDate} = useAuth()
    const [allVisits, setAllVisits] = useState([])
    
    const usersCollection = collection(db, "users")
    const [disabledTimes, setDisabledTimes] = useState([])
    const appointmentDate = currDay.toLocaleDateString("pl-PL").length < 10 
        ? `0${currDay.toLocaleDateString("pl-PL")}` 
        : currDay.toLocaleDateString("pl-PL");
    const currentTime = new Date().toLocaleTimeString("pl-PL");

    const [isClicked, setIsClicked] = useState(false)
    const [selectedTime, setSelectedTime] = useState("")
    const [isBlocked, setIsBlocked] = useOutletContext()
    const [successMessage, setSuccessMessage] = useState("")
    const [tempBlockedButtons, setTempBlockedButtons] = useState([])

    const tempBlockedVisits = doc(db, "temporaryBlocked", "IoNHZT2QMuMHsTuNC13Z")

    const checkIfVisitIsUnavailable = (dateString, time) => {
        return allVisits.some(visit => {
            return time === visit.time && dateString === visit.date
        });
    }


    //Block visit if exist

    useEffect(() => {
        const tempDisabledTimes = []
        times.forEach(time => {
            if (checkIfVisitIsUnavailable(appointmentDate, time)) {
                tempDisabledTimes.push({
                    time: time, 
                    date: appointmentDate})
            }
        })

        setDisabledTimes(tempDisabledTimes)
    }, [allVisits, currDay])

    //Check for scheduled visits

    useEffect(  () => {
        const visits = []
        const unsubscribe = onSnapshot(usersCollection, async (snapshot) => {
            snapshot.forEach(user => visits.push(...user.data().visits))   
            setAllVisits(visits)
        })

        return () => unsubscribe()
    }, [])

    //Temporary disabled buttons

    useEffect(  () => {
        const unsubscribe = onSnapshot(tempBlockedVisits, async (snapshot) => {
            setTempBlockedButtons(snapshot.data().tempBlockedVisits)
        })

        return () => unsubscribe()
    }, [])

    //Add visit to firebase

    const updateVisit = async (time) => {
        const userDoc = doc(usersCollection, user.uid)
        const visitsQuery = query(usersCollection, 
            where("date", "==", appointmentDate, 
            where("time", "==", time) ))
        const querySnapShot = await getDocs(visitsQuery)

        if (querySnapShot.size === 0) {
            await updateDoc(userDoc, {visits: arrayUnion({
                    date: appointmentDate,
                    time: time,
                    type: visitType})})

                    setIsClicked(false)
                    setSuccessMessage("Wizyta zarezerwowana! Do zobaczenia.")
        }
    }

    const showConfirmation = async (time) => {
        setIsClicked(true)
        setIsBlocked(true)
        setSelectedTime(time)
        await updateDoc(tempBlockedVisits, {tempBlockedVisits: arrayUnion({
            date: appointmentDate,
            time: time,
            type: visitType
        })})
    }

    const hideConfirmation = async (time, date) => {
        setIsClicked(false)
        setIsBlocked(false)
        await updateDoc(tempBlockedVisits, {tempBlockedVisits: arrayRemove({
            date: date,
            time: time,
            type: visitType
        })})
    }


    const disableCloserVisits = (date, time) => {
        date.setHours(parseInt(time.split(":")[0]), parseInt(time.split(":")[1]), 0)
        if (date.toLocaleDateString("pl-PL") === new Date().toLocaleDateString("pl-PL")
        && new Date().getHours() + 1 >= date.getHours()) {
            return true
        }
    }

    const disableSavedVisits = (date, time) => {
        if (disabledTimes.some((data => data.time === time && data.date === date))) {
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
                    <button key={time} className={`visit-time-button ${disableCloserVisits(currDay, time) ? "unavailable" : ""}`}
                        disabled={
                        disableCloserVisits(currDay, time) || 
                        disableSavedVisits(appointmentDate, time) 
                        || tempBlockedButtons.some(btn => btn.date === appointmentDate && btn.time === time)} 
                        onClick={() => showConfirmation(time)}>
                            {time}
                    </button>
                )
            })}
            {isClicked 
                        ? <Popup 
                            date={appointmentDate} 
                            weekDay={weekDay} 
                            time={selectedTime} 
                            cancel={hideConfirmation}
                            updateVisit={updateVisit}  />
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