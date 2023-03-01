import React, {useEffect, useState} from "react";
import {doc, updateDoc, arrayUnion, collection, onSnapshot} from "@firebase/firestore";
import {db} from "../../../../../firebase/firebase";
import {useAuth} from "../../../../context/AuthContext";


const Appointments = ({date, message}) => {

    const times = ['08:00','09:30','11:00','12:30','14:00']
    const {user} = useAuth()
    const [visitData, setVisitData] = useState([])
    const storedVisits = collection(db, "visits")
    const [disabledTimes, setDisabledTimes] = useState([])

    //Add blocking time < current time on today's date

    useEffect(() => {
        const tempDisabledTimes = []
        times.forEach(time => {
            if (checkIfVisitIsUnavailable(date.toLocaleDateString("pl-PL"), time)) {
                tempDisabledTimes.push(time)
            }
        })

        setDisabledTimes(tempDisabledTimes)
    }, [visitData, date])

    useEffect(  () => {
        onSnapshot(storedVisits, (snapshot) => {
            const data = snapshot.docs.map(visit => ({...visit.data()}))
            const mappedData = data[0].scheduledVisits.map(data => data)
            setVisitData(mappedData)
        })

    }, [])

    const checkIfVisitIsUnavailable = (dateString, time) => {
        return visitData.some(visit => {
            return time === visit.time && dateString === visit.date
        });
    }

    const updateVisit = async (e) => {
        const userDoc = doc(db, "users", user.uid)
        const visitsDoc = doc(db, "visits","OAVsMc63w3nMH4mTnDy9")

        if (visitData.length === 0) {
            await updateDoc(visitsDoc, {scheduledVisits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: e.target.innerText})})

            await updateDoc(userDoc, {visits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: e.target.innerText})})
            alert(`Wizyta zarezerwowana na ${message}, ${date.toLocaleDateString("pl-PL")} o godzinie ${e.target.innerText}`)

        } else if (!(checkIfVisitIsUnavailable(date.toLocaleDateString("pl-PL"), e.target.innerText))) {
            await updateDoc(visitsDoc, {scheduledVisits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: e.target.innerText})})

            await updateDoc(userDoc, {visits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: e.target.innerText})})
            alert(`Wizyta zarezerwowana na ${message}, ${date.toLocaleDateString("pl-PL")} o godzinie ${e.target.innerText}`)
        }
    }

    console.log(message[0]);

    return (
        <>
            <div className={"appointment_btn_container"}>
            {message === "Sobota" || message === "Niedziela" 
            ? null
            : times.map((time, indx) => {
                return (
                    <button className="visit-time-button"
                     disabled={disabledTimes.includes(time)} onClick={updateVisit} key={indx}>{time}</button>
                )
            })}
            </div>
        </>
    )
}

export default Appointments