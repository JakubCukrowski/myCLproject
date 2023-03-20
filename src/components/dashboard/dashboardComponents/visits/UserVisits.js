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
    const visitsRef = doc(db, 'visits', 'ozgzhj0nxfWQIYcs7PUU');
    const [reload, setReload] = useState(false)

    //Add delete older visits after new Date

    useEffect(() => {
        const getCollection = async () => {
            const userData = await getDoc(userCollection)
            const visitsData = await getDoc(visitsRef)
            setVisits(userData.data().visits)
            setAllVisits(visitsData.data().scheduledVisits)
            setStatus(true)
        }

        setReload(false)
        getCollection()
    }, [reload])

    const deleteVisit = async (date, time, type) => {
        await updateDoc(visitsRef, {scheduledVisits: arrayRemove({
            date: date,
            time: time
        })
    })

        await updateDoc(userCollection, {visits: arrayRemove({
            date: date,
            time: time,
            type: type
        })})

        setReload(true)

    }

    const visitCounts = () => {
        if (visits.length === 0) {
            return <h2>Nie masz żadnych wizyt</h2>
        } else if (visits.length === 1) {
            return <h2>Masz zaplanowaną {visits.length} wizytę</h2>
        } else if (visits.length > 1 && visits.length <= 4) {
            return <h2>Masz zaplanowane {visits.length} wizyty</h2>
        } else {
            return <h2>Masz zaplanowanych {visits.length} wizyt</h2>
        }
    }

    return (
        <>
            {status === false ? <Spinner/> : visitCounts()}
            {visits.length > 0
                ? <div className="container">
                <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Godzina</th>
                    <th>Data</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {visits
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .sort((a, b) => new Date(a.date.split(".").reverse().join("-")) - new Date(b.date.split(".").reverse().join("-")))
                    .map((visit, indx) =>
                    <tr key={indx}>
                        <td>{indx + 1}</td>
                        <td>{visit.time}</td>
                        <td>{visit.date}</td>
                        <td>
                            <button onClick={() => deleteVisit(visit.date, visit.time, visit.type)} className={"delete-visit-btn"}>
                                Usuń
                            </button>
                        </td>
                    </tr>)}
                </tbody>
            </Table>
                </div>
                : null}
        </>
    )
}

export default UserVisits



