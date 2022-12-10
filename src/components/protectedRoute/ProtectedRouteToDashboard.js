import React from "react";
import {Navigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext";

const ProtectedRouteToDashboard = ({ children }) => {
    const {user} = useAuth()

    if (!user) {
        return <Navigate to="/register"/>
    }

    return children
}

export default ProtectedRouteToDashboard