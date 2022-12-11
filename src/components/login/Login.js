import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext";
import {doc, getDocs, getDoc} from "@firebase/firestore";
import {db} from "../../firebase/firebase";



const Login = () => {
    const [data, setData] = useState( {
        email: "",
        password: ""
    } )
    const navigate = useNavigate()
    const {signIn, user} = useAuth()

    const handleRegister = (e) => {
        e.preventDefault()
        navigate("/register")
    }


    const handleData = (e) => {
        const { name, value } = e.target;
        setData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await signIn(data.email, data.password)
        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        <section>
            <form className="login-wrapper">
                <div className="container">
                    <p>Aby sprawdzić swoje wizyty, zaloguj się</p>
                    <div className="email-wrapper">
                        <label>Email:
                            <input name="email" value={data.email} type="email" onChange={handleData}/>
                        </label>
                    </div>
                    <div className="pass-wrapper">
                        <label>Hasło:
                            <input name="password" value={data.password} type="password" onChange={handleData}/>
                        </label>
                    </div>
                    <button onClick={handleLogin} className="login-btn">Zaloguj</button>
                    <p>Lub jeśli nie masz konta</p>
                    <button onClick={handleRegister} className="register-btn">Zarejestruj się</button>
                </div>
            </form>
        </section>
    )
}

export default Login