import mongoose from "mongoose";

let isConnected = false;

export default async function Connect() {
    try {
        if (!isConnected) {
            await mongoose.connect(process.env.MONGO_URI);
            isConnected = true;
            console.log('db is connected');
        } else {

        }
    } catch (err) {
        isConnected = false;
        console.log('db not connected :c', err);
    }
}