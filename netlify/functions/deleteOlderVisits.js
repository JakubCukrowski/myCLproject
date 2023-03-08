import * as admin from "firebase-admin";
const { private_key } = JSON.parse(process.env.REACT_APP_PRIVATE_KEY)

admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.TYPE,
        project_id: process.env.REACT_APP_PROJECT_ID,
        private_key_id: process.env.REACT_APP_PRIVATE_KEY_ID,
        private_key: private_key,
        client_email: process.env.REACT_APP_CLIENT_EMAIL,
        client_id: process.env.REACT_APP_CLIENT_ID,
        auth_uri: process.env.REACT_APP_AUTH_URI,
        token_uri: process.env.REACT_APP_TOKEN_URI,
        auth_provider_x509: process.env.REACT_APP_AUTH_PROVIDER_X509_CERT_URL,
        client_provider_x509: process.env.REACT_APP_CLIENT_X509_CERT_URL
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
