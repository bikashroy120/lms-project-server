import { app } from "./app.js";
import dotenv from "dotenv"
import {v2 as cloudinary} from "cloudinary"
import connectDB from "./utils/db.js";
dotenv.config

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    secret_key:process.env.CLOUD_SECRET_KEY,
})


app.listen(8000,()=>{
    console.log("server is running ")
    connectDB()
})
