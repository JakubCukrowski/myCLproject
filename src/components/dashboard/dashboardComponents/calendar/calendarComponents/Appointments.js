import React, {useEffect, useState} from "react";
import {doc, updateDoc, arrayUnion, collection, onSnapshot} from "@firebase/firestore";
import {db} from "../../../../../firebase/firebase";
import {useAuth} from "../../../../context/AuthContext";

const times = ['08:00','09:00','10:00','12:00','13:00']

const Appointments = ({date}) => {

    const {user} = useAuth()
    const [visitData, setVisitData] = useState([])
    const storedVisits = collection(db, "visits")

    useEffect(  () => {
        onSnapshot(storedVisits, (snapshot) => {
            const data = snapshot.docs.map(visit => ({...visit.data()}))
            const mappedData = data[0].scheduledVisits.map(data => data)
            setVisitData(mappedData)
            console.log(mappedData)
        })

    }, [])

    console.log(date.toLocaleDateString("pl-PL"))

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
            console.log("PIERWSZY WARUNEK SPELNIONY")

        } else if (!(visitData.some(visit => e.target.innerText === visit.time && date.toLocaleDateString("pl-PL") === visit.date))) {
            await updateDoc(visitsDoc, {scheduledVisits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: e.target.innerText})})

            await updateDoc(userDoc, {visits: arrayUnion({
                    date: date.toLocaleDateString("pl-PL"),
                    time: e.target.innerText})})
            alert("SA WIZYTY W TABELI ALE NIE A E.TARGET")

        } else {
            alert("VISIT ALREADY BOOKED")
        }
    }

    return (

        <div>
            {times.map((time, indx) => {
                return (
                    <button onClick={updateVisit} className="appointment-btn" key={indx}> {time} </button>
                )
            })}
        </div>
    )
}

export default Appointments