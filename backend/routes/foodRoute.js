import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import fs from 'fs';
import path from 'path';


const foodRouter = express.Router();
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Image Storage Engine
const storage = multer.diskStorage({
  // destination: "uploads",
    destination:  (req, file, cb) => {
      cb(null, "./uploads")
      // path.join(process.cwd(), "src/uploads"),
    },

    filename: (req, file, cb) => {
        // return cb(null, `${Date.now()}${file.originalname}`)
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
})

const upload = multer({ 
    // storage: storage
    storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg and .jpeg formats allowed!"));
    }
  }
 });

foodRouter.post("/add", upload.single("image"), addFood)
foodRouter.get("/list", listFood)
foodRouter.post("/remove", removeFood);


export default foodRouter;