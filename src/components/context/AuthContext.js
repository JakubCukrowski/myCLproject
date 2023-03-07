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
    // const storedVisits = doc(db, "visits", "ozgzhj0nxfWQIYcs7PUU")
    // const usersCollection = collection(db, "users")
    const currentDate = new Date().toLocaleDateString("pl-PL");

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

    //Function moved to cron-jobs

    // useEffect(() => {
    //     const deleteOlderVisits = async () => {
    //         const allSavedVisits = await getDoc(storedVisits)
    //         const visitsArray = allSavedVisits.data().scheduledVisits
    //         const filterVisits = visitsArray
    //             .filter(visit => visit.date <= currentDate)
    //             .filter(visit => visit.time < `${new Date().getHours()}:${new Date().getMinutes()}`)
    
    //         if (filterVisits.length > 0) {
    //             for (let i = 0; i < filterVisits.length; i++) {
    //                 const usersVisitsQuery = query(usersCollection, 
    //                     where("visits", "array-contains-any", [{date: filterVisits[i].date, time: filterVisits[i].time}])) 
                         
                        
    //                 const UsersVisitsQuerySnapshot = await getDocs(usersVisitsQuery)  
    //                 const userWithPastVisit = UsersVisitsQuerySnapshot.docs.map(user => ({...user.data(), id: user.id}))
    //                 const userDoc = doc(db, "users", userWithPastVisit[i].id)  
        
    //                 await updateDoc(storedVisits, {scheduledVisits: arrayRemove({
    //                     date: filterVisits[i].date,
    //                     time: filterVisits[i].time
    //                 })})
        
    //                 await updateDoc(userDoc, {visits: arrayRemove({
    //                     date: filterVisits[i].date,
    //                     time: filterVisits[i].time
    //                 })})
    //             }
    //         }
    //     }
    //     deleteOlderVisits()
    // }, [])


    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }



    const logout = () => {
        return signOut(auth)
    }

 return (
     <AuthContext.Provider value={{createAccount, user, signIn, logout, users, currentDate}}>
         {!loading && children}
     </AuthContext.Provider>

 )
}

export const useAuth = () => {
    return useContext(AuthContext)
}






