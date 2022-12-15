import React, {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {Link, useNavigate} from "react-router-dom";
import {
    faCalendarCheck,
    faCalendarPlus, faCircleArrowLeft, faCircleXmark,
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
    const [display, setDisplay] = useState("none")

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStatus(true)
        }, 500)

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

    const showDashboardMenu = () => {
        setDisplay(prevState => prevState === "none" ? "block" : "none")
    }

    return (
        <section className="dashboard">
            <div className="dashboard-content-wrapper">
                <Outlet/>
            </div>
            <nav style={{display}}>
                <div className="container">
                    {status === false ? <Spinner/> : <h3>Witaj, {user.displayName}</h3>}
                    <Link to="uservisits">
                        <div className="icon-wrapper" onClick={showDashboardMenu}>
                            <FontAwesomeIcon fontSize={50} icon={faCalendarCheck}/>
                            <p>Twoje wizyty</p>
                        </div>
                    </Link>
                    <Link to="savevisit">
                        <div className="icon-wrapper" onClick={showDashboardMenu}>
                            <FontAwesomeIcon fontSize={50} icon={faCalendarPlus}/>
                            <p>Umów wizytę</p>
                        </div>
                    </Link>
                    <Link to="settings">
                        <div className="icon-wrapper" onClick={showDashboardMenu}>
                            <FontAwesomeIcon fontSize={50} icon={faGear}/>
                            <p>Ustawienia konta</p>
                        </div>
                    </Link>
                    <Link to="/">
                        <div className="icon-wrapper" onClick={showDashboardMenu}>
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
            <FontAwesomeIcon onClick={showDashboardMenu}
                             className="menu-button"
                             icon={display === "none" ? faCircleArrowLeft : faCircleXmark}
                             fontSize={40}/>
        </section>
    )
}

export default Dashboard