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
    const [error, setError] = useState("")


    const handleInputs = (e) => {
        const { name, value } = e.target;
        setData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
        setError("")
    }

    const validate = () => {
        const errors = []
        if (data.displayName.length <= 2) errors.push("Imię za krótkie")
        if (data.password < 6) errors.push("Hasło musi mieć przynajmniej 6 znaków")
        if (data.password !== data.repeatedPassword) errors.push("Hasła nie zgadzają się")
        setError(errors.join(" oraz "))
        return errors.length <= 0
    }

    const signUp = async (e) => {
        e.preventDefault()
        try {
            if (data.password === data.repeatedPassword) {
                await createAccount(data.email, data.password, data.displayName)
            } else {
                validate()
            }
        } catch (err) {
            validate()
        }
    }


    return (
        <form className="register-form">
            <div className="container">
                <p>Zarejestruj się</p>
                <div style={{
                    textAlign: "center",
                    color: "darkred",
                    fontWeight: "bold",
                    fontSize: 18,
                    marginBottom: 10}}>
                    {error}</div>
                <div className={"register-form-wrapper"}>
                    <label>Imię</label>
                        <input required name="displayName" value={data.displayName} onChange={handleInputs} type="text"/>
                    <label>Email</label>
                        <input required name="email" value={data.email} onChange={handleInputs} type="email"/>
                    <label>Hasło</label>
                        <input required name="password" value={data.password} onChange={handleInputs} type="password"/>
                    <label>Powtórz hasło</label>
                        <input required
                            name="repeatedPassword"
                            value={data.repeatedPassword}
                            onChange={handleInputs}
                            type="password"/>
                </div>
                <button onClick={signUp} className="create-acc-btn">Utwórz konto</button>
            </div>
        </form>
    )
}

export default Register