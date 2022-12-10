import {Link, Outlet} from "react-router-dom";
import '../../scss/navbar.scss'
import Footer from "../footer/Footer";
import {useAuth} from "../context/AuthContext";
import {useEffect, useState} from "react";

const Navbar = () => {

    const {user} = useAuth()

    const [loggingIn, setLoggingIn] = useState(true)

    useEffect(() => {
        if (user !== null) {
            setLoggingIn(false)
        }
    }, [])

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
                    <ul>
                        <li><Link to="/offer">Oferta</Link></li>
                        <li><Link to="/contact">Kontakt</Link></li>
                        <li><Link to="/prices">Cennik</Link></li>
                        <li><Link to="/gallery">Galeria</Link></li>
                        <li>
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