import mongoose from "mongoose";


const layoutSchema = new mongoose.Schema({
    type:{
        type:String,
        required:[true,"Please enter your name"],
        unique:true,
    },
    home:{
      logo:String,
      title:String,
      subTitle:String,
      Trusted:String,
      image:String,
      review:Number,
      Courses:Number,
      Tutors:Number,
      Certified:Number,
      Students:Number,
      phone:String,
      email:String,
      address:String,
      text:String,
      links:[{title:String,url:String}]
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