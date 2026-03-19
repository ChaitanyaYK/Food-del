import jwt from 'jsonwebtoken'

const authMiddleware = async (req , res , next) =>{
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;
    if (!token) {
        return res.status(401).json({success:false,message:"Not Authorized, Login Again"});
    }
    try {
        const token_decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = token_decode;
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

export default authMiddleware;