

import mongoose from "mongoose";


const contactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
    },
    phone:{
        type:String,
    },
    message:{
        type:String
    },

},{timestamps:true})

const contactModal = mongoose.model("Contact",contactSchema)

export default contactModal