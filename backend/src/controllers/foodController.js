import Food from "../models/foodModel.js";
import fs from 'fs';


// add food item
const addFood = async (req , res) => {
    try {
        const image = req.file;
        const { name, description, price, category } = req.body;

        if (!image) {
            return res.status(400).json({ error: "Image is required" });
        }
    
        const addFoodItem = await Food.create({
            name: name,
            description: description,
            price: price,
            category: category,
            image: image.filename
        })
        await addFoodItem.save();
        res.json({success:true, addFoodItem, message:"Food Added"})
    } catch (error){
        console.log(error);
        res.status(500).json({ success:false, message: error.message });  
    }
}

// all food list 
const listFood = async (req, res) => {
    try {
        const foodLists = await Food.find({});
        res.status(200).json({success:true, foodLists, message: "Food list fetch successfully"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error in fetching food list"});
    }
}

// remove food item
const removeFood = async (req, res) => {
    try {
        const {foodId} = req.params;
        const removeFoodItem = await Food.findById(foodId);
        fs.unlink(`uploads/${removeFoodItem.image}`,(err)=>{
            if (err) console.error("File deletion error:", err);
        });

        await Food.findByIdAndDelete(foodId);
        res.status(200).json({success:true, removeFoodItem, message:"Food Removed Successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false, message: error.message });
    }
}

export {addFood, listFood, removeFood};