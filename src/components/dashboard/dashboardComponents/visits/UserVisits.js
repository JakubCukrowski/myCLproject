import React, {useEffect, useState} from "react";
import {doc, getDoc, updateDoc, arrayRemove} from "@firebase/firestore";
import {db} from "../../../../firebase/firebase";
import {useAuth} from "../../../context/AuthContext";
import Table from 'react-bootstrap/Table';
import Spinner from "react-bootstrap/Spinner";

const UserVisits = ()=> {

    const {user} = useAuth()
    const userCollection = doc(db, "users", user.uid)
    const [visits, setVisits] = useState([])
    const [allVisits, setAllVisits] = useState([])
    const [status, setStatus] = useState(false)
    const visitsRef = doc(db, 'visits', 'OAVK4XngrGnMbsWkrlbO');

    //Add delete older visits after new Date

    useEffect(() => {
        const getCollection = async () => {
            const userData = await getDoc(userCollection)
            const visitsData = await getDoc(visitsRef)
            setVisits(userData.data().visits)
            setAllVisits(visitsData.data().scheduledVisits)
            setStatus(true)
        }


        getCollection()
    }, [visits])

    const deleteVisit = async (date, time) => {
        await updateDoc(visitsRef, {scheduledVisits: arrayRemove({
            date: date,
            time: time
        })
        })

        await updateDoc(userCollection, {visits: arrayRemove({
            date: date,
            time: time
        })})
    }

    const visitCounts = () => {
        if (visits.length === 0) {
            return <h1>Nie masz żadnych wizyt</h1>
        } else if (visits.length === 1) {
            return <h1>Masz zaplanowaną {visits.length} wizytę</h1>
        } else if (visits.length > 1 && visits.length <= 4) {
            return <h1>Masz zaplanowane {visits.length} wizyty</h1>
        } else {
            return <h1>Masz zaplanowanych {visits.length} wizyt</h1>
        }
    }

    return (
        <>

            {status === false ? <Spinner/> : visitCounts()}
            {visits.length > 0
                ? <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Godzina</th>
                    <th>Data</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {visits.map((visit, indx) =>
                    <tr key={indx}>
                        <td>{indx + 1}</td>
                        <td>{visit.time}</td>
                        <td>{visit.date}</td>
                        <td><button onClick={() => deleteVisit(visit.date, visit.time)} className={"delete-visit-btn"}>Usuń</button></td>
                    </tr>)}
                </tbody>
            </Table>
                : null}
        </>
    )
}

export default UserVisits



