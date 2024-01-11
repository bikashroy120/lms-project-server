import mongoose from "mongoose"


const orderSchema = new mongoose.Schema({
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    payment_info:{
        type:Object,
    },
},{timestamps:true})


const orderModale = mongoose.model("Order",orderSchema)

export default orderModale