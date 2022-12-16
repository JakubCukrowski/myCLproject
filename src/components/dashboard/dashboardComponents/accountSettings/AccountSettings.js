import React, {useState} from "react";
import {useAuth} from "../../../context/AuthContext";
import {updateProfile, updateEmail} from "firebase/auth";
import {doc, updateDoc} from "@firebase/firestore";
import {db} from "../../../../firebase/firebase";

const AccountSettings = () => {

    const {user} = useAuth()
    const [editing, setEditing] = useState(false)
    const [userData, setUserData] = useState({
        displayName: "",
        email: ""
    })
    const userRef = doc(db, "users", user.uid)

    const handleEdit = () => {
        setEditing(prevState => !prevState)
    }

    const handleChangeData = () => {
        updateProfile(user, {
            displayName: userData.displayName,
        })
            .then(() => updateDoc(userRef, {
                name: userData.displayName
            }))
            .then(() => alert("Pomyślnie zmieniono dane"))
        updateEmail(user, userData.email)
            .then(() => updateDoc(userRef, {
                email: userData.email
            }))
        setEditing(false)
        window.location.reload()
    }

    const handleInputs = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
        console.log(userData.displayName, userData.email)
    }

    return (
        <>
            <h2>Zarządzanie kontem</h2>
            <div className="user-data-container">
                <p>Imię: {user.displayName.toUpperCase()}</p>
                {editing ? <input onChange={handleInputs} value={userData.displayName} type="text" name="displayName"/> : null}
                <p>Email: {user.email}</p>
                {editing ? <input onChange={handleInputs} value={userData.email} type="email" name="email"/> : null}
                <div>
                    <button onClick={handleEdit} className="edit-btn">{editing ? "Anuluj" : "Edytuj"}</button>
                    {editing ? <button onClick={handleChangeData} className="edit-btn">Zapisz</button> : null}
                </div>
                <button className="delete-btn">Usuń konto</button>
            </div>
        </>
    )
}

export default AccountSettings