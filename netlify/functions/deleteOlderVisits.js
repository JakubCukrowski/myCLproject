import * as admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.TYPE,
        projectId: process.env.PROJECT_ID,
        privateKeyId: process.env.PRIVATE_KEY_ID,
        privateKey: process.env.PRIVATE_KEY,
        clientEmail: process.env.CLIENT_EMAIL,
        clientId: process.env.CLIENT_ID,
        authUri: process.env.AUTH_URI,
        tokenUri: process.env.TOKEN_URI,
        authProviderX509: process.env.AUTH_PROVIDER_X509_CERT_URL,
        clientProviderX509: process.env.CLIENT_X509_CERT_URL
    })
})

const db = admin.firestore();
const storedVisits = doc(db, "visits", "ozgzhj0nxfWQIYcs7PUU")
const usersCollection = collection(db, 'users');

exports.handler = async () => {
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
