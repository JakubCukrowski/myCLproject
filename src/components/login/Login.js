import React, {useState} from "react";
import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext";

const Login = () => {
    const [data, setData] = useState( {
        email: "",
        password: ""
    } )
    const navigate = useNavigate()
    const [error, setError] = useState([])
    const {signIn} = useAuth()

    const handleRegister = (e) => {
        e.preventDefault()
        navigate("/register")
    }

    const validate = () => {
        const errors = []
        if (data.email.length <= 2) errors.push("Email musi być dłuższy niż 2 znaki")
        if (data.password.length < 6) errors.push("Hasło musi mieć minimum 6 znaków")
        setError(errors.join(" oraz "))
        return errors.length <= 0
    }

    const onInputsChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
        setError("")
    };

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await signIn(data.email, data.password)
        } catch (e) {
            console.log(e.message)
            validate()
        }
    }

    return (
        <section>
            <form className="login-wrapper">
                <div className="container">
                    <div style={{color: "darkred", fontWeight: "bold", fontSize: 18, marginBottom: 10}}>{error}</div>
                    <p>Aby sprawdzić swoje wizyty, zaloguj się</p>
                    <div className="email-wrapper">
                        <label>Email
                            <input name="email" value={data.email} type="email" onChange={onInputsChange}/>
                        </label>
                    </div>
                    <div className="pass-wrapper">
                        <label>Hasło
                            <input name="password" value={data.password} type="password" onChange={onInputsChange}/>
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