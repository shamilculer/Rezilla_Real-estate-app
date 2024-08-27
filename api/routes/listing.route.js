import express from "express"
import { getListings, getListing, addListing, getMinMaxPrice, deleteListing } from "../controller/listings.controller.js"
import multer from "multer"
import verifyToken from "../middleware/verifyToken.js"

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.get("/", getListings)
router.get('/getprices', getMinMaxPrice)
router.post("/new", verifyToken, upload.array('images'), addListing)
router.get("/:id", getListing)
router.delete("/delete/:id", verifyToken, deleteListing)

export default router