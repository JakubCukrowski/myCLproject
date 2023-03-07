const admin = require("firebase-admin")
const serviceAccount = require("../.netlify/psychology-77338-firebase-adminsdk-tscp5-74406d4aa3.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore();
const storedVisits = doc(db, "visits", "ozgzhj0nxfWQIYcs7PUU")
const usersCollection = collection(db, 'users');

export async function handler() {
    const allSavedVisits = await getDoc(storedVisits)
    const visitsArray = allSavedVisits.data().scheduledVisits
    const filterVisits = visitsArray
        .filter(visit => visit.date <= new Date().toLocaleDateString("pl-PL"))
        .filter(visit => visit.time < `${new Date().getHours()}:${new Date().getMinutes()}`)

    if (filterVisits.length > 0) {
        for (let i = 0; i < filterVisits.length; i++) {
            const usersVisitsQuery = query(usersCollection, 
                where("visits", "array-contains-any", [{date: filterVisits[i].date, time: filterVisits[i].time}])) 
                 
                
            const UsersVisitsQuerySnapshot = await getDocs(usersVisitsQuery)  
            const userWithPastVisit = UsersVisitsQuerySnapshot.docs.map(user => ({...user.data(), id: user.id}))
            const userDoc = doc(db, "users", userWithPastVisit[i].id)  

            await updateDoc(storedVisits, {scheduledVisits: arrayRemove({
                date: filterVisits[i].date,
                time: filterVisits[i].time
            })})

            await updateDoc(userDoc, {visits: arrayRemove({
                date: filterVisits[i].date,
                time: filterVisits[i].time
            })})
        }
    }
}
