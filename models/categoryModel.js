import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:String
},{timestamps:true})


const CategoryModal = mongoose.model("Category",categorySchema)

export default CategoryModal