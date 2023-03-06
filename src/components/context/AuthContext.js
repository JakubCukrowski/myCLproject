import {createContext, useContext, useEffect, useState} from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import {auth, db} from "../../firebase/firebase";
import {setDoc, doc, getDoc, getDocs, query, where, collection, updateDoc, arrayRemove} from "@firebase/firestore";

const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const usersRef = collection(db, "users")
    const [users, setUsers] = useState([])
    const storedVisits = doc(db, "visits", "ozgzhj0nxfWQIYcs7PUU")
    const usersCollection = collection(db, "users")

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

    useEffect(() => {
        const intervalID = setInterval(() => {
            const deleteOlderVisits = async () => {
                const allSavedVisits = await getDoc(storedVisits)
                const visitsArray = allSavedVisits.data().scheduledVisits
                const filterVisits = visitsArray
                    .filter(visit => visit.date <= new Date().toLocaleDateString("pl-PL"))
                    .filter(visit => visit.time < `${new Date().getHours()}:${new Date().getMinutes()}`)
        
        
                if (filterVisits.length !== 0) {
                    const usersVisitsQuery = query(usersCollection, 
                        where("visits", "array-contains-any", [{date: filterVisits[0].date, time: filterVisits[0].time}]))  
                        
                    const UsersVisitsQuerySnapshot = await getDocs(usersVisitsQuery)  
                    const userWithPastVisit = UsersVisitsQuerySnapshot.docs.map(user => ({...user.data(), id: user.id}))
                    const userDoc = doc(db, "users", userWithPastVisit[0].id)  
        
                    await updateDoc(storedVisits, {scheduledVisits: arrayRemove({
                        date: filterVisits[0].date,
                        time: filterVisits[0].time
                    })})
        
                    await updateDoc(userDoc, {visits: arrayRemove({
                        date: filterVisits[0].date,
                        time: filterVisits[0].time
                    })})
           
                }
            }
            deleteOlderVisits()
        }, 1000 * 60 * 30);
        return () => clearInterval(intervalID)
    }, [])


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






