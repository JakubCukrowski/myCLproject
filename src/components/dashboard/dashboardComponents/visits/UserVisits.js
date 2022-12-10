import React, {useEffect, useState} from "react";
import {doc, getDoc} from "@firebase/firestore";
import {db} from "../../../../firebase/firebase";
import {useAuth} from "../../../context/AuthContext";
import Table from 'react-bootstrap/Table';
import {Button} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

const UserVisits = ()=> {

    const {user} = useAuth()
    const userCollection = doc(db, "users", user.uid)
    const [visits, setVisits] = useState([])
    const [status, setStatus] = useState(false)

    useEffect(() => {
        const getCollection = async () => {
            const data = await getDoc(userCollection)
            setVisits(data.data().visits)
            setStatus(true)
        }

        getCollection()
    }, [])

    const visitCounts = () => {
        if (visits.length === 0) {
            return <h1>Nie masz żadnych wizyt</h1>
        } else if (visits.length === 1) {
            return <h1>Masz zaplanowaną {visits.length} wizytę</h1>
        } else {
            return <h1>Masz zaplanowane {visits.length} wizyty</h1>
        }
    }

    return (
        <div>

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
                        <td><Button variant={"success"}>Usuń</Button></td>
                    </tr>)}
                </tbody>
            </Table>
                : null}
        </div>
    )
}

export default UserVisits



