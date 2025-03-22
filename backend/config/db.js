import mongoose from "mongoose";

export const connectDB = async () => {
    
    await mongoose.connect("mongodb+srv://chaitanya:foodapp@cluster1.ddrxq.mongodb.net/").then(()=>console.log("DB Connected"))
}