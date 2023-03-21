import { doc, collection, getDoc, getDocs, query, updateDoc, arrayRemove, where } from "@firebase/firestore";
import { db } from "../../src/firebase/firebase";

const storedVisits = doc(db, "visits", "ozgzhj0nxfWQIYcs7PUU")
const usersCollection = collection(db, 'users');

exports.handler = async function() {
    const allSavedVisits = await getDoc(storedVisits)
    const visitsArray = allSavedVisits.data().scheduledVisits
    const filterVisits = visitsArray
        .filter(visit => visit.date <= new Date().toLocaleDateString("pl-PL"))
        .filter(visit => visit.time < `${new Date().getHours()}:${new Date().getMinutes()}`)

        console.log(filterVisits);

    if (filterVisits.length > 0) {
        for (let i = 0; i < filterVisits.length; i++) {
            const usersVisitsQuery = query(usersCollection, 
                where("visits", "array-contains-any", [{
                    date: filterVisits[i].date, 
                    time: filterVisits[i].time, 
                    type: filterVisits[i].type}])) 
                 
                
            const UsersVisitsQuerySnapshot = await getDocs(usersVisitsQuery)  
            const userWithPastVisit = UsersVisitsQuerySnapshot.docs.map(user => ({...user.data(), id: user.id}))
            console.log(userWithPastVisit);
            const userDoc = doc(db, "users", userWithPastVisit[i].id)  

            await updateDoc(storedVisits, {scheduledVisits: arrayRemove({
                date: filterVisits[i].date,
                time: filterVisits[i].time,
                type: filterVisits[i].type
            })})

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
