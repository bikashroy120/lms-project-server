import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        select:true
    },
    address:String,
    avater:{
        type:String
    },
    role:{
        type:String,
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    courses:[
        {
            courseId:String
        }
    ]
},{timestamps:true})

const userModal = mongoose.model("User",userSchema)

export default userModal