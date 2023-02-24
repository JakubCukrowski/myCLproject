import {Link, Outlet, useLocation} from "react-router-dom";
import '../../scss/navbar.scss'
import Footer from "../footer/Footer";
import {useAuth} from "../context/AuthContext";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faXmark, faFaceGrinHearts} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const {user} = useAuth()
    const {pathname} = useLocation()
    const [loggingIn, setLoggingIn] = useState(true)
    const mediaQuery = "(max-width: 900px)";
    const mediaQueryMatch = window.matchMedia(mediaQuery);
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsscrolled] = useState(false)

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

    useEffect(() => {
        const navbarTreshold = 30
        const nav = document.querySelector(".navbar-section")
        const links = document.querySelectorAll(".desktop a")
        const logoText = document.querySelector(".logo-container p")

        if (pathname !== "/"){
            setIsscrolled(true)
            nav.classList.add("scrolled")
            links.forEach(link => link.classList.add("link-color"))
            logoText.classList.add("link-color")
            
        } else {
            nav.classList.remove("scrolled")
            links.forEach(link => link.classList.remove("link-color"))
            logoText.classList.remove("link-color")
        }

        const changeColor = () => {
            if (window.scrollY >= navbarTreshold && pathname === "/") {
                setIsscrolled(true)
                nav.classList.add("scrolled")
                links.forEach(link => link.classList.add("link-color"))
                logoText.classList.add("link-color")
    
            } else if (window.scrollY < navbarTreshold && pathname === "/"){
                setIsscrolled(false)
                nav.classList.remove("scrolled")
                links.forEach(link => link.classList.remove("link-color"))
                logoText.classList.remove("link-color")
            }
        }
        
        window.addEventListener("scroll", changeColor)
        return () => window.removeEventListener("scroll", changeColor);
    }, [pathname, isScrolled])

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
            <section className="navbar-section" style={{position: pathname === "/" ? "fixed" : "sticky", }}>
                <div className="navbar-container">
                    <div className="logo-container">
                        <Link to="/">
                            <FontAwesomeIcon icon={faFaceGrinHearts} fontSize={80} color={isScrolled ? "#9d9a9a" : "white"}/>
                        </Link>
                        <p>Pracownia psychologiczna</p>
                    </div>
                    <div className={"hamburger-menu"}>
                        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className={"X_bars"} fontSize={40} onClick={showHamMenu}/>
                    </div>
                    <ul className={isMobile ? "mobile" : "desktop"} style={isMobile ? hamburgerStyles : null}>
                        <li onClick={isOpen ? showHamMenu : null}><Link to="/offer">Oferta</Link></li>
                        <li onClick={isOpen ? showHamMenu : null}><Link to="/contact">Kontakt</Link></li>
                        <li onClick={isOpen ? showHamMenu : null}><Link to="/prices">Cennik</Link></li>
                        <li onClick={isOpen ? showHamMenu : null}><Link to="/gallery">Galeria</Link></li>
                        <li onClick={isOpen ? showHamMenu : null}>
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