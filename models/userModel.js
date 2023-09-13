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
    avater:{
        public_id:String,
        url:String,
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


userSchema.methods.SignAccessToken = ()=>{
    return jwt.sign({id:this._id},process.env.ACCRSS_TOKEN || " " )
}

userSchema.methods.SignRefreshToken = ()=>{
    return jwt.sign({id:this._id},process.env.REFRESH_TOKEN || " " )
}



const userModal = mongoose.model("User",userSchema)

export default userModal