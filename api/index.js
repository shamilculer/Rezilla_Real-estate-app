import express from "express"
import dotenv from  "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import setupSocketServer from "./utils/socketServerSetup.js"
import { createServer } from "http"
import authRoutes from "./routes/auth.route.js"
import listingRoutes from "./routes/listing.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"


const app = express()
dotenv.config()
const httpServer = createServer(app)

app.use(cors({origin : process.env.CLIENT_URL, credentials : true}))
app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/user', userRoutes)
app.use('/api/inbox', chatRoutes)


const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("database connection established")

        httpServer.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000 }`)
        })
        
        setupSocketServer(httpServer)
    } catch (error) {
        console.log(error)
    }
}

startServer()