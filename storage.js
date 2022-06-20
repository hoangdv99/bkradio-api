import admin from 'firebase-admin'

const firebase = admin.initializeApp({
  credential: admin.credential.cert('./bkradio-54014ee5317f.json'),
  storageBucket: 'bkradio.appspot.com'
})

export const storage = admin.storage()
