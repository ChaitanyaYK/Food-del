import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connetionInstance = await mongoose.connect(process.env.DATABASE_KEY);
        console.log("Mongodb connected on host:", connetionInstance.connection.host);
        
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
}