import mongoose from "mongoose";

export const connectDB = async () => {
    
    await mongoose.connect(process.env.DATABASE_KEY).then(()=>console.log("DB Connected"))
}