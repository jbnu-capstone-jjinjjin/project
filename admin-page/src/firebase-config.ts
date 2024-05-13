import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyC90lKBx6ZkgOCqiZ5bnixqoB3u0rkTfDU',
  authDomain: 'jbnu-capstone-2024.firebaseapp.com',
  projectId: 'jbnu-capstone-2024',
  storageBucket: 'jbnu-capstone-2024.appspot.com',
  messagingSenderId: '922757487427',
  appId: '1:922757487427:web:afb27312ceaa568a522df6'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
