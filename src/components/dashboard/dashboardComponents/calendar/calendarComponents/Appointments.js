import React, {useEffect, useState} from "react";
import {doc, updateDoc, arrayUnion, collection, onSnapshot} from "@firebase/firestore";
import {db} from "../../../../../firebase/firebase";
import {useAuth} from "../../../../context/AuthContext";
import AppointmentBtn from "./AppointmentBtn";

const times = ['08:00','09:00','10:00','12:00','13:00']

const Appointments = ({date}) => {

    const {user} = useAuth()
    const [visitData, setVisitData] = useState([])
    const storedVisits = collection(db, "visits")
    const [disabledTimes, setDisabledTimes] = useState([])

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
        console.log(date.toLocaleDateString("pl-PL"), e.target.innerText)

        if (visitData.length === 0) {
            await updateDoc(visitsDoc, {scheduledVisits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: e.target.innerText})})

            await updateDoc(userDoc, {visits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: e.target.innerText})})
            alert(`Wizyta zarezerwowana na ${date} o godzinie ${e.target.innerText}`)

        } else if (!(checkIfVisitIsUnavailable(date.toLocaleDateString("pl-PL"), e.target.innerText))) {
            await updateDoc(visitsDoc, {scheduledVisits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: e.target.innerText})})

            await updateDoc(userDoc, {visits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: e.target.innerText})})
            alert(`Wizyta zarezerwowana na ${date.toLocaleDateString("pl-PL")} o godzinie ${e.target.innerText}`)

        } else {
            alert(`Ta wizyta jest już zajęta`)
        }
    }

    return (

        <div className={"appointment_btn_container"}>
            {times.map((time, indx) => {
                return (
                    <AppointmentBtn disabled={disabledTimes.includes(time)} onClick={updateVisit} key={indx} title={time}/>
                )
            })}
        </div>
    )
}

export default Appointments