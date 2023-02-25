import React, {useState} from "react";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const [data, setData] = useState({
        displayName: "",
        email: "",
        password: "",
        repeatedPassword: ""
    })
    const navigate = useNavigate()
    const {createAccount} = useAuth()
    const {users} = useAuth()
    const usersEmails = users.map(user => user.email)
    const [errors, setErrors] = useState({
        displayName: false,
        email: false,
        password: false,
        repeatedPassword: false
    })


    const handleInputs = (e) => {
        const { name, value } = e.target;
        setData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
        setErrors(prevState => {
            return {
                ...prevState,
                [name]: false
            }
        })
    }

    const signUp = async (e) => {
        e.preventDefault()
        
        if (data.displayName.length < 3) {
            setErrors(prevState => {
                return {
                    ...prevState,
                    displayName: true
                }
            })
        }

        if ((data.email.indexOf("@") === -1 && data.email.indexOf(".") === -1) || usersEmails.includes(data.email)) {
            setErrors(prevState => {
                return {
                    ...prevState,
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

        if (data.repeatedPassword !== data.password) {
            setErrors(prevState => {
                return {
                    ...prevState,
                    repeatedPassword: true
                }
            })
        }

        if (!errors.displayName && !errors.email && !errors.password && !errors.repeatedPassword) {
            try {
                await createAccount(data.email, data.password, data.displayName)
            } 
            catch (err) {
                console.log(err);
            }
        }

    }

    const navigateToLogin = () => {
        navigate("/login")
    }


    return (
        <form className="register-form">
            <div className="container">
                <p>Zarejestruj się</p>
                <div className={"register-form-wrapper"}>
                    <div className="input-field">
                        <label>Imię</label>
                        <input className={errors.displayName ? "error" : null}
                        required name="displayName" value={data.displayName} onChange={handleInputs} type="text"/> 
                        {errors.displayName 
                        ? <span style={{display: "block", color: "tomato", fontSize: 12}}>Imię za krótkie</span> 
                        : null}
                    </div>
                    <div className="input-field">
                        <label>Email</label>
                        <input className={errors.email ? "error" : null}
                        required name="email" value={data.email} onChange={handleInputs} type="email"/>
                        {errors.email && (data.email.indexOf("@") === -1 || data.email.indexOf(".") === -1)
                        ? <span style={{display: "block", color: "tomato", fontSize: 12}}>Email nie jest poprawny</span>
                        : null}
                        {usersEmails.includes(data.email) && errors.email
                        ? <span style={{display: "block", color: "tomato", fontSize: 12}}>Email jest już zajęty</span>
                        : null}
                    </div>
                    <div  className="input-field">
                        <label>Hasło</label>
                        <input className={errors.password ? "error" : null}
                        required name="password" value={data.password} onChange={handleInputs} type="password"/>
                        {errors.password 
                        ? <span style={{display: "block", color: "tomato", fontSize: 12}}>Hasło musi mieć 6 lub więcej znaków</span> 
                        : null}
                    </div>
                    <div  className="input-field">
                        <label>Powtórz hasło</label>
                        <input className={errors.repeatedPassword ? "error" : null}
                            required
                            name="repeatedPassword"
                            value={data.repeatedPassword}
                            onChange={handleInputs}
                            type="password"/>
                            {errors.repeatedPassword 
                        ? <span style={{display: "block", color: "tomato", fontSize: 12}}>Hasła nie zgadzają się</span> 
                        : null}
                    </div>
                    
                </div>
                <div className="btns-wrapper">
                    <button onClick={navigateToLogin} className="create-acc-btn">Logowanie</button>
                    <button onClick={signUp} className="create-acc-btn">Utwórz konto</button>
                </div>
            </div>
        </form>
    )
}

export default Register