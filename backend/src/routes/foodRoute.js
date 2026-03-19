import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import fs from 'fs';
import path from 'path';
import authMiddleware from "../middleware/auth.js";


const foodRouter = express.Router();
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
}

// Image Storage Engine
const storage = multer.diskStorage({
  // destination: "uploads",
    destination:  (req, file, cb) => {
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
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

foodRouter.post(
  "/add", 
  authMiddleware,
  upload.single("image"),
  addFood,
);
foodRouter.get("/list", listFood);
foodRouter.post("/remove/:foodId", authMiddleware, removeFood);

export default foodRouter;