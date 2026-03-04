import mongoose from "mongoose";

export const connectDB = async () => {
    
    await mongoose.connect(process.env.DATABASE_KEY).then(()=>console.log("DB Connected")).catch((error) =>console.error("DB Connection Error:", error));

}