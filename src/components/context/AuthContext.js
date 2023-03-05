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
import {setDoc, doc, getDocs, collection} from "@firebase/firestore";

const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const usersRef = collection(db, "users")
    const [users, setUsers] = useState([])

    const createAccount = (email, password, name) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then(async result => {
                const ref = doc(db, "users", result.user.uid)
                await updateProfile(result.user, {
                    displayName: name})
                const docRef = await setDoc(ref, {name: name, email: email, visits: ""})
                const updatedUser = {...result.user, displayName: name}
                setUser(updatedUser)
            })

    }

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersRef)
            const filteredData = data.docs.map(doc => ({...doc.data(), id: doc.id}))
            setUsers(filteredData)
        }

        getUsers();
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
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
     <AuthContext.Provider value={{createAccount, user, signIn, logout, users}}>
         {!loading && children}
     </AuthContext.Provider>

 )
}

export const useAuth = () => {
    return useContext(AuthContext)
}






