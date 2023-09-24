import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true 
    },
    title:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"unread"
    },
},{timestamps:true})


const notificationModal = mongoose.model("Notification",notificationSchema)

export default notificationModal