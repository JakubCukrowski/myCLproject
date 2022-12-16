import React from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const ProtectedRouteToLogin = ({ children }) => {
    const {user} = useAuth()

    if (user) {
        return <Navigate to="/dashboard/savevisit"/>
    }
    return children

}

export default ProtectedRouteToLogin