import React, {useState} from "react";
import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext";

const Login = () => {
    const [data, setData] = useState( {
        email: "",
        password: ""
    } )
    const navigate = useNavigate()
    const [errors, setErrors] = useState({
        email: false,
        password: false
    })
    const {signIn} = useAuth()
    const {users} = useAuth()
    const userEmails = users.map(user => user.email)

    const handleRegister = (e) => {
        e.preventDefault()
        navigate("/register")
    }

    const onInputsChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
        setErrors(prev => {
            return {
                ...prev,
                [name]: false
            }
        })
    };


    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await signIn(data.email, data.password)
        } catch (e) {
            if (!userEmails.includes(data.email)) {
                setErrors(prev => {
                    return {
                        ...prev,
                        email: true
                    }
                })
            }

            if (data.password.length < 6) {
                setErrors(prevState => {
                    return {
                        ...prevState,
                        password: true
                    }
                })
            }
        }
        
    }

    return (
        <section>
            <form className="login-wrapper">
                <div className="container">
                    <p>Aby sprawdzić swoje wizyty, zaloguj się</p>
                    <div className="email-wrapper">
                        <label>Email
                            <input className={errors.email ? "error" : null} 
                            name="email" 
                            value={data.email} 
                            type="email" 
                            onChange={onInputsChange}/>
                        </label>
                        {errors.email  
                        ? <span style={{display: "block", color: "tomato", fontSize: 12}}>
                            Podany email nie istnieje
                            </span> 
                        : null}
                    </div>
                    <div className="pass-wrapper">
                        <label>Hasło
                            <input className={errors.password ? "error" : null} 
                            name="password" 
                            value={data.password} 
                            type="password" 
                            onChange={onInputsChange}/>
                        </label>
                        {errors.password  
                        ? <span style={{display: "block", color: "tomato", fontSize: 12}}>Hasło musi mieć 6 lub więcej znaków</span>
                         : null}
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