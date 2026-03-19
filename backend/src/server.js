import 'dotenv/config'
import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import cookieParser from "cookie-parser";


// app config
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//CORS setting
const allowOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_SERVER_URL,
];
app.use(cors({
    origin: (origin, callback) => {
        console.log("Request Origin:", origin);
        console.log("Allowed Origins:", allowOrigins);
        if (!origin || allowOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// db connection
connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server started on port: ${port}`);
    })
})
.catch((error) => {
    console.log("Error in DB connection!", error);
});

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);


app.get("/", (req, res)=>{
    res.send("API Working");
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});



