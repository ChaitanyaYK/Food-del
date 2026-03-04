import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config.js'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"


// app config
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(express.json())

//CORS setting
const allowOrigins = [
    process.env.FRONTEND_SERVER_URL,
    "http://localhost:5173"
]
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)


app.get("/", (req, res)=>{
    res.send("API Working")
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})

