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
import analyticsRoute from "./routes/analyticsRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import contactRoute from "./routes/contactRoute.js"
import layoutRoute from "./routes/layoutRoute.js"


dotenv.config()



// body parser
app.use(express.json({limit:"50mb"}))

// cookie parser
app.use(cookieParser())

// cors origin resouse shering
// CORS origin resource sharing
app.use(cors());

// routes
app.use("/api/v1",userRoute)
app.use("/api/v1/course",coruseRoute)
app.use("/api/v1/order",orderRoute)
app.use("/api/v1/",notificationRoute)
app.use("/api/v1/",analyticsRoute)
app.use("/api/v1/",categoryRoute)
app.use("/api/v1/contact/",contactRoute)
app.use("/api/v1/layout/",layoutRoute)

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