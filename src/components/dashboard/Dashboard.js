import React, {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {Link, useNavigate} from "react-router-dom";
import {
    faCalendarCheck,
    faCalendarPlus,
    faGear,
    faHouse,
    faPowerOff,
    faBars,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useAuth} from "../context/AuthContext";
import Spinner from "react-bootstrap/Spinner";

const Dashboard = () => {
    const navigate = useNavigate()
    const {user, logout} = useAuth()
    const [status, setStatus] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStatus(true)
        }, 200)

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

    const handleHamburgerMenu = () => {
        setIsOpen(prev => !prev)
        if (isOpen === false) {
            document.querySelector("body").style.overflow = "hidden"
        } else {
            document.querySelector("body").style.overflow = "auto"
        }
    }

    return (
        <section className={`dashboard ${isOpen ? "blocked" : ""}`}>
            <div className={`navbar-wrapper ${isOpen ? "open" : ""}`}>
                {status ? <h3>Witaj, {user.displayName}</h3> : <Spinner/>}
                <ul>
                    <Link onClick={handleHamburgerMenu} to="/">
                        <li className="icon-wrapper">
                            <FontAwesomeIcon fontSize={30} icon={faHouse}/>
                            <p>Strona główna</p>
                        </li>
                    </Link>
                    <Link onClick={handleHamburgerMenu} to="uservisits">
                        <li className="icon-wrapper">
                            <FontAwesomeIcon fontSize={30} icon={faCalendarCheck}/>
                            <p>Twoje wizyty</p>
                        </li>
                    </Link>
                    <Link onClick={handleHamburgerMenu} to="savevisit">
                        <li className="icon-wrapper">
                            <FontAwesomeIcon fontSize={30} icon={faCalendarPlus}/>
                            <p>Umów wizytę</p>
                        </li>
                    </Link>
                    <Link onClick={handleHamburgerMenu} to="settings">
                        <li className="icon-wrapper">
                            <FontAwesomeIcon fontSize={30} icon={faGear}/>
                            <p>Ustawienia konta</p>
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
            <div className="top-line">
                <FontAwesomeIcon className="menu-button"
                                icon={isOpen ? faXmark : faBars}
                                onClick={handleHamburgerMenu}
                                fontSize={30}/>
            </div>
            <div className="dashboard-content-wrapper">
                <Outlet/>
            </div>
        </section>
    )
}

export default Dashboard