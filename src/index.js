// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({ path: './.env' });
connectDB()

    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT} `)
        })
        app.on('error', (err) => {
            console.error('❌ Server Error:', err);
            process.exit(1); // Gracefully exit the process
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection failed!', err);
        process.exit(1); // Gracefully exit on DB connection failure
    });






/*
import express from 'express';
const app = express();

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        // Handle and log errors that occur in the Express app
        app.on('error', (error) => {
            console.log('Error: ', error);
            throw error
        })
        
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error('Error: ', error);
        throw error
    }
})()
*/