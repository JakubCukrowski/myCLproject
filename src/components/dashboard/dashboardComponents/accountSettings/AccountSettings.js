import React, {useState} from "react";
import {useAuth} from "../../../context/AuthContext";
import {updateProfile, updateEmail} from "firebase/auth";
import {doc, updateDoc} from "@firebase/firestore";
import {db} from "../../../../firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";

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

    //ADD PAST VISITS VIEW OPTION
    //ADD PAYMENT METHOD SELECT/ OR SOMETHING

    return (
        <>
            <h2>Zarządzanie kontem</h2>
            <div className="user-data-container">
                <div>
                    <FontAwesomeIcon icon={faUser} fontSize={40}/>
                    <p>Imię: {user.displayName.toUpperCase()}</p>
                </div>
                {editing ? <input onChange={handleInputs} value={userData.displayName} type="text" name="displayName"/> : null}
                <div>
                    <FontAwesomeIcon icon={faEnvelope} fontSize={40}/>
                    <p>Email: {user.email}</p>
                </div>
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