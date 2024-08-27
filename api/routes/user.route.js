import express from "express";
import { updateUser, getUserListings } from "../controller/user.controller.js";
import multer from "multer"
import verifyToken from "../middleware/verifyToken.js";

const storage = multer.memoryStorage()
const upload = multer({ storage })
const router = express.Router();

router.put("/update/:id", upload.single('profileImage') ,updateUser);
router.get("/listings/:id", verifyToken, getUserListings);

export default router