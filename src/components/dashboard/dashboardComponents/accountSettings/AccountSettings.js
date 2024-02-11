import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { updateEmail } from "firebase/auth";
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";

const AccountSettings = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const userRef = doc(db, "users", user.uid);

  const handleEdit = () => {
    setEditing((prevState) => !prevState);
  };

  const handleChangeData = () => {
    updateEmail(user, userEmail).then(() =>
      updateDoc(userRef, {
        email: userEmail,
      })
    );
    setEditing(false);
  };

  const handleInputs = (e) => {
    setUserEmail(e.target.value);
  };

  return (
    <>
      <h2>Zarządzanie kontem</h2>
      <div className="user-data-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            marginBottom: 10,
          }}
        >
          <FontAwesomeIcon icon={faUser} fontSize={40} />
          <p style={{ marginBottom: 0 }}>{user.displayName.toUpperCase()}</p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            marginBottom: 10,
          }}
        >
          <FontAwesomeIcon icon={faEnvelope} fontSize={40} />
          <p style={{ marginBottom: 0 }}>Email: {user.email}</p>
        </div>
        {editing ? (
          <input
            onChange={handleInputs}
            value={userEmail}
            type="email"
            name="email"
          />
        ) : null}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            marginBottom: 10,
          }}
        >
          <button onClick={handleEdit} className="edit-btn">
            {editing ? "Anuluj" : "Zmień email"}
          </button>
          {editing ? (
            <button onClick={handleChangeData} className="edit-btn">
              Zapisz
            </button>
          ) : null}
        </div>
        <button className="delete-btn">Usuń konto</button>
      </div>
    </>
  );
};

export default AccountSettings;
