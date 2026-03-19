import User from "../models/userModel.js";

// add items to user cart
const addToCart = async (req , res)=>{
    try {
        const userId = req.user._id;
        const { itemId } = req.body;
        const userData = await User.findById(userId);
        let cartData = await userData.cartData;
        if (!cartData) cartData = {};

        if(!cartData[itemId]){
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        await userData.save();

        await User.findByIdAndUpdate(userId,{ cartData });
        res.status(200).json({success:true, message:"Added To Cart"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false, message: error.message });
    }
}


// remove items from user cart 
const removeFromCart = async (req,res)=>{
    try {
        const userId = req.user._id;
        const { itemId } = req.body;
        const userData = await User.findById(userId);
        const cartData = await userData.cartData;
        if (cartData[itemId]>0) {
            cartData[itemId] -= 1;
        }
        const updatedCart = await User.findByIdAndUpdate(userId, { cartData });
        res.status(200).json({success:true, updatedCart, message:"Removed From Cart"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false, message: error.message });
    }
}

// fetch user cart data 
const getCart = async (req,res)=>{
    try {
        const {userId} = req.user._id;
        const userData = await User.findById(userId);
        const cartData = await userData.cartData;
        res.status(200).json({success:true, cartData, message: "User cart Data "})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false, message: error.message });
    }
}

export {addToCart, removeFromCart, getCart} 