const { initializeApp } = require('firebase/app')
const { getStorage } = require('firebase/storage')
const dotenv = require('dotenv')

dotenv.config({path: './config.env'})

const firebaseConfig = {
    apiKey: process.env.FB_API_KEY,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    appId: process.env.FB_APP_ID
  };
  
  const firebaseApp = initializeApp(firebaseConfig);

  const storage = getStorage(firebaseApp)

  module.exports = {storage}