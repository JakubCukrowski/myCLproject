import React, {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {Link, useNavigate} from "react-router-dom";
import {
    faCalendarCheck,
    faCalendarPlus,
    faGear,
    faHouse,
    faPowerOff
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useAuth} from "../context/AuthContext";
import Spinner from "react-bootstrap/Spinner";

const Dashboard = () => {
    const navigate = useNavigate()
    const {user, logout} = useAuth()
    const [status, setStatus] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStatus(true)
        }, 1000)

        return () => timeout
    }, [])

    const handleLogOut = async () => {
        try {
            await logout()
            navigate("/")
        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        <section className="dashboard">
            <div className="dashboard-content-wrapper">
                <Outlet/>
            </div>
            <nav>
                <div className="container">
                    {status === false ? <Spinner/> : <h3>Witaj, {user.displayName}</h3>}
                    <Link to="uservisits">
                        <div className="icon-wrapper">
                            <FontAwesomeIcon fontSize={50} icon={faCalendarCheck}/>
                            <p>Twoje wizyty</p>
                        </div>
                    </Link>
                    <Link to="savevisit">
                        <div className="icon-wrapper">
                            <FontAwesomeIcon fontSize={50} icon={faCalendarPlus}/>
                            <p>Umów wizytę</p>
                        </div>
                    </Link>
                    <Link to="settings">
                        <div className="icon-wrapper">
                            <FontAwesomeIcon fontSize={50} icon={faGear}/>
                            <p>Ustawienia konta</p>
                        </div>
                    </Link>
                    <Link to="/">
                        <div className="icon-wrapper">
                            <FontAwesomeIcon fontSize={50} icon={faHouse}/>
                            <p>Strona główna</p>
                        </div>
                    </Link>
                    <button onClick={handleLogOut}>
                        <div className="icon-wrapper">
                            <FontAwesomeIcon fontSize={50} icon={faPowerOff}/>
                            <p>Wyloguj</p>
                        </div>
                    </button>
                </div>
            </nav>
        </section>
    )
}

export default Dashboard