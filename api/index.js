import express from 'express'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

//Router
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO)
.then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err) )

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500 
    const message = err.message || "Internal Server Error" 
    console.log(err);
   return res.status(statusCode).json({success: false, statusCode, message})
})

app.listen(3000, () => {
    console.log("Server is Running on port 3000!!!");
})