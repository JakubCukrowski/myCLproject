import React from "react";
import {doc, updateDoc, arrayUnion} from "@firebase/firestore";
import {db} from "../../../../../firebase/firebase";
import {useAuth} from "../../../../context/AuthContext";

const times = ['08:00','09:00','10:00','12:00','13:00']

const Appointments = ({date}) => {

    const {user} = useAuth()


    const updateVisit = async (e) => {
        const userDoc = doc(db, "users", user.uid)
        const visitsDoc = doc(db, "visits","OAVsMc63w3nMH4mTnDy9")
        await updateDoc(visitsDoc, {scheduledVisits: arrayUnion({
                date: date.toLocaleDateString("pl-PL"),
                time: e.target.innerText,
                user: user.email})})

        await updateDoc(userDoc, {visits: arrayUnion({
                date: date.toLocaleDateString("pl-PL"),
                time: e.target.innerText})})

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