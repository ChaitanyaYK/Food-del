import mongoose from "mongoose";
import Food from "./src/models/foodModel.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { food_list } from "./src/data/foodData.js";

dotenv.config();

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const seedFood = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_KEY);

        await Food.deleteMany();

        const assetsDir = path.join(process.cwd(), "../frontend/src/assets");

        const files = fs.readdirSync(assetsDir);

        files.forEach(file => {
            const srcPath = path.join(assetsDir, file);
            const destPath = path.join(uploadDir, file);

            if (!fs.existsSync(destPath)) {
                fs.copyFileSync(srcPath, destPath);
            }
        })


        const foodData = food_list.map(item => {

            return {
                name: item.name,
                price: item.price,
                description: item.description,
                category: item.category,
                image: item.image,
            }
        })

        await Food.insertMany(foodData);

        console.log("food data inserted");
        process.exit();
    } catch (error) {
        console.log("Error in insert food data");
        process.exit(1)
    }
};

seedFood();