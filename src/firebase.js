import { initializeApp } from 'firebase'

// in the real world, we should not hardcode these values.

const app = initializeApp({
  apiKey: 'AIzaSyAcyH1fR16IFMwsxX6qDKvppvrIS8KD2I0',
  authDomain: 'vue-employees-app-86817.firebaseapp.com',
  databaseURL: 'https://vue-employees-app-86817.firebaseio.com',
  projectId: 'vue-employees-app-86817',
  storageBucket: 'vue-employees-app-86817.appspot.com',
  messagingSenderId: '1028404614887'
})

export const db = app.database()
export const storage = app.storage()
