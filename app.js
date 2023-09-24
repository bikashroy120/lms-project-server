import express from "express";

export const app = express()
import cors  from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

import { ErrorMiddleware } from "./middleware/error.js";
import  userRoute  from "./routes/userRoute.js";
import coruseRoute from "./routes/courseRoute.js"
import orderRoute from "./routes/orderRoute.js"
import notificationRoute from "./routes/notificationRoute.js"


dotenv.config()



// body parser
app.use(express.json({limit:"50mb"}))

// cookie parser
app.use(cookieParser())

// cors origin resouse shering
app.use(
    cors({
        origin:process.env.ORIGIN
    })
)

// routes
app.use("/api/v1",userRoute)
app.use("/api/v1/course",coruseRoute)
app.use("/api/v1/order",orderRoute)
app.use("/api/v1/",notificationRoute)

// testing api
app.get("/test",(req,res,next)=>{
    res.status(200).json({
        message:"this is test route",
        success:true
    })
})


// unnone route
app.all("*",(req,res,next)=>{
    const err = new Error("Route not valied !")
    err.statusCode = 404;
    next(err)
})

app.use(ErrorMiddleware)