import {createContext, useContext, useEffect, useState} from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import {auth, db} from "../../firebase/firebase";
import {useNavigate} from "react-router-dom";
import {setDoc, doc} from "@firebase/firestore";

const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const createAccount = (email, password, name) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then(async result => {
                const ref = doc(db, "users", result.user.uid)
                await updateProfile(result.user, {
                    displayName: name})
                const docRef = await setDoc(ref, {name: name, email: email, visits: ""})
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            navigate(`/dashboard/savevisit`)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user])


    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

 return (
     <AuthContext.Provider value={{createAccount, user, signIn, logout}}>
         {!loading && children}
     </AuthContext.Provider>

 )
}

export const useAuth = () => {
    return useContext(AuthContext)
}






