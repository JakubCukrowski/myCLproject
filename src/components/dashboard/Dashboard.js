import React, {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {Link, useNavigate} from "react-router-dom";
import {
    faCalendarCheck,
    faCalendarPlus,
    faCircleArrowRight,
    faCircleXmark,
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
    // const [status, setStatus] = useState(false)

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         setStatus(true)
    //     }, 200)

    //     return () => timeout
    // }, [])

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
            <div className="navbar-wrapper">
                {user ? <h3>Witaj, {user.displayName}</h3> : <Spinner/>}
                <ul>
                    <Link to="uservisits">
                        <li className="icon-wrapper">
                            <FontAwesomeIcon fontSize={30} icon={faCalendarCheck}/>
                            <p>Twoje wizyty</p>
                        </li>
                    </Link>
                    <Link to="savevisit">
                        <li className="icon-wrapper">
                            <FontAwesomeIcon fontSize={30} icon={faCalendarPlus}/>
                            <p>Umów wizytę</p>
                        </li>
                    </Link>
                    <Link to="settings">
                        <li className="icon-wrapper">
                            <FontAwesomeIcon fontSize={30} icon={faGear}/>
                            <p>Ustawienia konta</p>
                        </li>
                    </Link>
                    <Link to="/">
                        <li className="icon-wrapper">
                            <FontAwesomeIcon fontSize={30} icon={faHouse}/>
                            <p>Strona główna</p>
                        </li>
                    </Link>
                    <li className="icon-wrapper">
                        <button onClick={handleLogOut}>
                            <FontAwesomeIcon fontSize={30} icon={faPowerOff}/>
                            <p>Wyloguj</p>
                        </button>
                    </li>
                </ul>
            </div>
            <div className="dashboard-content-wrapper">
                <Outlet/>
            </div>
            {/* <FontAwesomeIcon onClick={showDashboardMenu}
                             className="menu-button"
                             icon={display === "none" ? faCircleArrowRight : faCircleXmark}
                             fontSize={30}/> */}
        </section>
    )
}

export default Dashboard