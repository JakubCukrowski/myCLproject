import { doc, collection, getDoc, getDocs, query, updateDoc, arrayRemove, where } from "@firebase/firestore";
import { db } from "../../src/firebase/firebase";

const usersCollection = collection(db, 'users');

exports.handler = async function() {
    
    const visits = []
    const querySnapshot = await getDocs(usersCollection);
    querySnapshot.forEach(doc => visits.push(...doc.data().visits))
    const filterVisits = visits
        .filter(visit => visit.date <= new Date().toLocaleDateString("pl-PL"))
        .filter(visit => visit.time < `${new Date().getHours()}:${new Date().getMinutes()}`)

    if (filterVisits.length > 0) {
        for (let i = 0; i < filterVisits.length; i++) {
            const usersVisitsQuery = query(usersCollection, 
                where("visits", "array-contains-any", [{
                    date: filterVisits[i].date, 
                    time: filterVisits[i].time, 
                    type: filterVisits[i].type}])) 
                 
                
            const UsersVisitsQuerySnapshot = await getDocs(usersVisitsQuery)  
            const userWithPastVisit = UsersVisitsQuerySnapshot.docs.map(user => ({...user.data(), id: user.id}))
            const userDoc = doc(db, "users", userWithPastVisit[i].id)  

            await updateDoc(userDoc, {visits: arrayRemove({
                date: filterVisits[i].date,
                time: filterVisits[i].time,
                type: filterVisits[i].type
            })})
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Function completed successfully' })
      }
}
