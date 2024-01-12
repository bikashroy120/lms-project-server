import mongoose from "mongoose";


const layoutSchema = new mongoose.Schema({
    type:{
        type:String,
        required:[true,"Please enter your name"],
        unique:true,
    },
    home:{
      title:String,
      subTitle:String,
      Trusted:String,
      image:String,
      review:Number,
    },
    contact:{
        phone:String,
        email:String,
        address:String,
        text:String,
        links:[{title:String,url:String}]
    },
    message:{
        type:String
    },

},{timestamps:true})

const layoutModal = mongoose.model("Layout",layoutSchema)

export default layoutModal