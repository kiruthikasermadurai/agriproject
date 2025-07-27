import mongoose from 'mongoose';

const MONGO_URI = "mongodb://127.0.0.1:27017/agridb";

export const connectDB = async () => {
    try{
        console.log("mongo_uri : ",MONGO_URI);
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(error){
        console.log("Error connection to MongoDB: ",error.message);
        process.exit(1) // 1 is failure, 0 status code is success
    }
};