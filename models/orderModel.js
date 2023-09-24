import mongoose from "mongoose"


const orderSchema = new mongoose.Schema({
    courseId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    payment_info:{
        type:Object,
    },
},{timestamps:true})


const orderModale = mongoose.model("Order",orderSchema)

export default orderModale