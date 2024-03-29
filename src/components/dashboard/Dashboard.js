import React, {useState} from "react";
import {Outlet, Link, navigate, useNavigate} from "react-router-dom";
import Navbar from "../navbar/Navbar"
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarCheck,
    faCalendarPlus,
    faGear,
    faPowerOff,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
    const [isBlocked, setIsBlocked] = useState(false)
    const navigate = useNavigate()
    const {user, logout} = useAuth()

    const handleLogOut = async () => {
        try {
            await logout()
            navigate("/")
        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        <section className={`dashboard ${isBlocked ? "blocked" : ""}`}>
            <Navbar/>
            <div className="container">
            <div className="dashboard-content-wrapper">
                <ul className="personal-info">
                    <p>Miło Cię widzieć, {user.displayName}.</p>
                    <li className="icon-wrapper">
                        <Link to="uservisits">
                            <FontAwesomeIcon fontSize={20} icon={faCalendarCheck}/>
                            <p>Twoje wizyty</p>
                        </Link>
                    </li>
                    <li className="icon-wrapper">
                        <Link to="savevisit">
                            <FontAwesomeIcon fontSize={20} icon={faCalendarPlus}/>
                            <p>Umów wizytę</p>
                        </Link>
                    </li>
                    <li className="icon-wrapper">
                        <Link to="settings">
                            <FontAwesomeIcon fontSize={20} icon={faGear}/>
                            <p>Ustawienia konta</p>
                        </Link>    
                    </li>
                    <li className="icon-wrapper">
                        <button onClick={handleLogOut}>
                            <FontAwesomeIcon fontSize={20} icon={faPowerOff}/>
                            <p>Wyloguj</p>
                        </button>
                    </li>
                </ul>
                <div className="dashboard-outlet-wrapper"> 
                    <Outlet context={[isBlocked, setIsBlocked]}/>
                </div>
            </div>
            </div>
        </section>
    )
}

export default Dashboard
