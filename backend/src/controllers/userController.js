import User from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


// login user 
const loginUser = async (req , res) => {
    const {email,password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({success:false, message:"User Doesn't exist"});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const {accessToken, refreshToken} = await createAccessRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        }

        res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({success:true, accessToken, refreshToken, message: "Login sucessfull"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false, message: error.message });
    }
}


const createAccessRefreshToken = async(userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return {accessToken, refreshToken};
}


// logout user
const logoutUser = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            res.status(403).json({message: "Your not logged in"})
        }

        res
        .status(200)
        .clearCookie("refreshToken")
        .clearCookie("accessToken")
        .json({message: "Logout Successful"});
    } catch (error) {
        res.status(500).json({message:"Error while logout"})
    }
}


// register user
const registerUser = async (req, res) => {
    try {
        const {name, password, email} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required"});
        }

        // checking is user already exists
        const exists = await User.findOne({email});
        if (exists) {
            return res.status(409).json({success:false, message:"User already exists"});
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.status(401).json({ success: false, message: "Please enter a valid email" });
        }

        if(!validator.isStrongPassword(password)){
            return res.status(401).json({success:false, message: "Please enter a strong password"});
        }

        const newUser = await User.create({
            name:name,
            email:email,
            password
        });

        const user = await newUser.save();

        const { accessToken, refreshToken } = await createAccessRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        }
        
        res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({success:true, accessToken, refreshToken, message: "User registered successfully"});

    } catch (error) {
        res.status(500).json({ success:false, message: error.message });
    }
}

export {loginUser, registerUser, logoutUser};