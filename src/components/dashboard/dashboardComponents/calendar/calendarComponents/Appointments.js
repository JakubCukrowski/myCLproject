import React, {useEffect, useState} from "react";
import {doc, updateDoc, arrayUnion, collection, onSnapshot, query, where, getDocs} from "@firebase/firestore";
import {db} from "../../../../../firebase/firebase";
import {useAuth} from "../../../../context/AuthContext";

const Appointments = ({date, message}) => {

    const times = ['08:00','09:30','11:00','12:30','14:00']
    const {user, currentDate} = useAuth()
    const [visitData, setVisitData] = useState([])
    const storedVisits = doc(db, "visits", "ozgzhj0nxfWQIYcs7PUU")
    const visitsCollection = collection(db, "visits")
    const [disabledTimes, setDisabledTimes] = useState([])
    const appointmentDate = date.toLocaleDateString("pl-PL");
    const currentTime = new Date().toLocaleTimeString("pl-PL");

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

    const updateVisit = async (e) => {
        const userDoc = doc(db, "users", user.uid)
        const visitsQuery = query(visitsCollection, 
            where("date", "==", date.toLocaleDateString("pl-PL"), 
            where("time", "==", e.target.innerText) ))
        const querySnapShot = await getDocs(visitsQuery)

        if (querySnapShot.size === 0) {
            await updateDoc(storedVisits, {scheduledVisits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: e.target.innerText})})

            await updateDoc(userDoc, {visits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: e.target.innerText})})
            alert(`Wizyta zarezerwowana na ${message}, ${date.toLocaleDateString("pl-PL")} o godzinie ${e.target.innerText}`)
        }
    }

    return (
        <div className={"appointment_btn_container"}>
        {message === "Sobota" || message === "Niedziela" 
        ? null
        : 
        times.map((time) => {
            if (appointmentDate === currentDate && currentTime >= time) {
                return null;
            }
            return (
                <button key={time} className="visit-time-button"
                disabled={
                    disabledTimes.some(data => data.time === time && data.date === date.toLocaleDateString("pl-PL"))} 
                    onClick={updateVisit}>
                        {time}
                </button>
            )
        })}
        </div>
    )
}

export default Appointments