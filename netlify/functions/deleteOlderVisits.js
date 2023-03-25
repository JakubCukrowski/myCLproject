import { doc, collection, getDocs, query, updateDoc, arrayRemove, where } from "@firebase/firestore";
import { db } from "../../src/firebase/firebase";

const usersCollection = collection(db, 'users');

exports.handler = async function() {
    
    const visits = []
    const currentDateLocalFormat = new Date()
    const currentTime = new Date().getHours() <= 9 
    ? `0${new Date().getHours() + 1}:${new Date().getMinutes()}`
    : `${new Date().getHours() + 1}:${new Date().getMinutes()}`
    console.log(currentTime);
    const querySnapshot = await getDocs(usersCollection);
    querySnapshot.forEach(doc => visits.push(...doc.data().visits))
    const filterVisits = visits.filter(visit => {
        const visitDate = visit.date.split(".").reverse().join("-")
        const currentDateTransformedToDDMM = new Date().toLocaleDateString("pl-PL").split(".").reverse().join("-")
        return new Date(visitDate) <= currentDateLocalFormat 
        && (visit.time && new Date(visitDate + " " + visit.time) <= new Date(currentDateTransformedToDDMM + " " + currentTime))
    })
        

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