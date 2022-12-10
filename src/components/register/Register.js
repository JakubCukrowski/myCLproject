import React, {useState} from "react";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";


const Register = () => {
    const [data, setData] = useState({
        displayName: "",
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const {createAccount, user} = useAuth()


    const handleInputs = (e) => {
        const { name, value } = e.target;
        setData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    const signUp = async (e) => {
        e.preventDefault()
        try {
            await createAccount(data.email, data.password, data.displayName)
            navigate(`/dashboard/savevisit`)
        } catch (err) {
            console.log(err.message)
        }
    }


    return (
        <form className="register-form">
            <div className="container">
                <p>Zarejestruj się</p>
                <label>Imię:
                    <input name="displayName" value={data.displayName} onChange={handleInputs} type="text"/>
                </label>
                <label>Email:
                    <input name="email" value={data.email} onChange={handleInputs} type="email"/>
                </label>
                <label>Hasło:
                    <input name="password" value={data.password} onChange={handleInputs} type="password"/>
                </label>
                <button onClick={signUp} className="create-acc-btn">Utwórz konto</button>
            </div>
        </form>
    )
}

export default Register