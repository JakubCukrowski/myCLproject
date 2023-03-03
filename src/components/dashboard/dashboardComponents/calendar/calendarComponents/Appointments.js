import React, {useEffect, useState} from "react";
import {doc, updateDoc, arrayUnion, collection, onSnapshot, getDoc, query, where, getDocs} from "@firebase/firestore";
import {db} from "../../../../../firebase/firebase";
import {useAuth} from "../../../../context/AuthContext";


const Appointments = ({date, message}) => {

    const times = ['08:00','09:30','11:00','12:30','14:00']
    const {user} = useAuth()
    const [visitData, setVisitData] = useState([])
    const storedVisits = collection(db, "visits")
    const [disabledTimes, setDisabledTimes] = useState([])
    const appointmentDate = date.toLocaleDateString("pl-PL");
    const currentDate = new Date().toLocaleDateString("pl-PL");
    const currentTime = new Date().toLocaleTimeString("pl-PL");

    const checkIfVisitIsUnavailable = (dateString, time) => {
        return visitData.some(visit => {
            return time === visit.time && dateString === visit.date
        });
    }

    useEffect(() => {
        const tempDisabledTimes = []
        times.forEach(time => {
            if (checkIfVisitIsUnavailable(date.toLocaleDateString("pl-PL"), time)) {
                tempDisabledTimes.push(time)
            }
        })

        setDisabledTimes(tempDisabledTimes)
    }, [visitData])

    useEffect(  () => {
        onSnapshot(storedVisits, (snapshot) => {
            const data = snapshot.docs.map(visit => ({...visit.data()}))
            const mappedData = data[0].scheduledVisits.map(data => data)
            setVisitData(mappedData)
        })

    }, [])

    const updateVisit = async (e) => {
        const userDoc = doc(db, "users", user.uid)
        const visitsDoc = doc(db, "visits", "OAVK4XngrGnMbsWkrlbO")
        const visitsCollection = collection(db, "visits")
        const visitsQuery = query(visitsCollection, 
            where("date", "==", date.toLocaleDateString("pl-PL"), 
            where("time", "==", e.target.innerText) ))
        const querySnapShot = await getDocs(visitsQuery)

        if (querySnapShot.size === 0) {
            await updateDoc(visitsDoc, {scheduledVisits: arrayUnion({
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
        : times.map((time, indx) => {
            if (appointmentDate === currentDate && currentTime >= time) {
                return null;
            }
            return (
                <>
                    <button className="visit-time-button"
                    disabled={disabledTimes.includes(time)} onClick={updateVisit} key={indx}>{time}</button>
                </>
            )
        })}
        </div>
    )
}

export default Appointments