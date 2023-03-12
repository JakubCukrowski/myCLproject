import {Link, Outlet, useLocation} from "react-router-dom";
import '../../scss/navbar.scss'
import Footer from "../footer/Footer";
import {useAuth} from "../context/AuthContext";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faXmark, faHeart} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const {user} = useAuth()
    const {pathname} = useLocation()
    const [loggingIn, setLoggingIn] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsscrolled] = useState(false)

    useEffect(() => {
        if (user !== null) {
            setLoggingIn(false)
        }
    }, [])

    useEffect(() => {
        const navbarTreshold = 80
        const nav = document.querySelector(".navbar-section")

        if (pathname !== "/"){
            setIsscrolled(true)
            nav.classList.add("scrolled")
            setIsOpen(false)
            
        } else {
            nav.classList.remove("scrolled")
        }

        const changeColor = () => {
            if (window.scrollY >= navbarTreshold && pathname === "/") {
                setIsscrolled(true)
                nav.classList.add("scrolled")
    
            } else if (window.scrollY < navbarTreshold && pathname === "/"){
                setIsscrolled(false)
                nav.classList.remove("scrolled")
                
            }
        }
        
        window.addEventListener("scroll", changeColor)
        return () => window.removeEventListener("scroll", changeColor);
    }, [pathname, isScrolled])

    const showHamMenu = () => {
        setIsOpen(prev => !prev)
        if (isOpen === false) {
            document.querySelector("body").style.overflow = "hidden"
        } else {
            document.querySelector("body").style.overflow = "auto"
        }
    }

    const scrollToTop = () => {
        window.scrollTo(0, 0)
    }

    return (
        <>
            <section className="navbar-section" style={{position: pathname === "/" ? "fixed" : "sticky"}}>
                <div className="navbar-container">
                    <Link to="/">
                        <div className="logo-container">
                            <FontAwesomeIcon icon={faHeart} fontSize={80} color={"white"} style={{paddingLeft: 10}}/>
                            <p>Pracownia psychologiczna</p>
                        </div>
                    </Link>
                    <div className={"hamburger-menu"}>
                        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className={"X_bars"} onClick={showHamMenu}/>
                    </div>
                    <ul className={isOpen? "links open" : "links"}>
                        <li onClick={isOpen ? showHamMenu : null}><Link onClick={scrollToTop} to="/offer">Oferta</Link></li>
                        <li onClick={isOpen ? showHamMenu : null}><Link onClick={scrollToTop} to="/contact">Kontakt</Link></li>
                        <li onClick={isOpen ? showHamMenu : null}><Link onClick={scrollToTop} to="/prices">Cennik</Link></li>
                        <li onClick={isOpen ? showHamMenu : null}><Link onClick={scrollToTop} to="/gallery">Galeria</Link></li>
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