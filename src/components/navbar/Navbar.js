import {Link, Outlet} from "react-router-dom";
import '../../scss/navbar.scss'
import Footer from "../footer/Footer";
import {useAuth} from "../context/AuthContext";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faXmark} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const {user} = useAuth()
    const [loggingIn, setLoggingIn] = useState(true)
    const mediaQuery = "(max-width: 900px)";
    const mediaQueryMatch = window.matchMedia(mediaQuery);
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false)

    const [hamburgerStyles, setHamburgerStyles] = useState({
        display: "none",
        right: -300
    })

    useEffect(() => {
        const checkScreenWidth = () => {
            if (window.innerWidth < 900) {
                setIsMobile(true)
            } else {
                setIsMobile(false)
                setIsOpen(false)
                setHamburgerStyles({
                    display: "none",
                    right: -300
                })
            }
        }
        return checkScreenWidth()
    },[])

    useEffect(() => {
        const handleClassByMediaQuery = (event) => {
            const isMobile = event.matches;

            return setIsMobile(isMobile);
        };
        mediaQueryMatch.addEventListener("change", handleClassByMediaQuery);

        return () => {
            mediaQueryMatch.removeEventListener("change", handleClassByMediaQuery);
        };
    }, [isMobile, mediaQueryMatch, isOpen]);

    useEffect(() => {
        if (user !== null) {
            setLoggingIn(false)
        }
    }, [])

    const showHamMenu = () => {
        setHamburgerStyles(prevState => ({
            display: prevState.display === "none" ? "flex" : "none",
            right: prevState.right === -300 ? 0 : -300
        }))
        setIsOpen(prevState => !prevState)
        if (isOpen === false) {
            document.querySelector("body").style.overflow = "hidden"
        } else {
            document.querySelector("body").style.overflow = "auto"
        }
    }

    return (
        <>
            <section className="navbar-section">
                <div className="navbar-container">
                    <div className="logo-container">
                        <Link to="/">
                            <img src={require('./logo_img/psychologia.png')} alt="logo"/>
                        </Link>
                        <p>Pracownia psychologiczna</p>
                    </div>
                    <div className={"hamburger-menu"}>
                        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} fontSize={40} onClick={showHamMenu}/>
                    </div>
                    <ul className={isMobile ? "mobile" : "desktop"} style={isMobile ? hamburgerStyles : null}>
                        <li onClick={showHamMenu}><Link to="/offer">Oferta</Link></li>
                        <li onClick={showHamMenu}><Link to="/contact">Kontakt</Link></li>
                        <li onClick={showHamMenu}><Link to="/prices">Cennik</Link></li>
                        <li onClick={showHamMenu}><Link to="/gallery">Galeria</Link></li>
                        <li onClick={showHamMenu}>
                            {loggingIn
                                ? <Link to="login">Zaloguj</Link>
                                : <Link to="dashboard/savevisit">Witaj, {user.displayName}</Link>}
                        </li>
                    </ul>
                </div>
            </section>
            <Outlet/>
            <Footer/>
        </>

    )
}

export default Navbar