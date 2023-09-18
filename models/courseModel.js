import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
    user:Object,
    rating:{
        type:Number,
        default:0
    },
    comment:String
})


const linkSchema = new mongoose.Schema({
    title:String,
    url:String,
})

const commrntSchema = new mongoose.Schema({
    user:Object,
    comment:String,
    commentReples:[Object]
})

const courseDataSchema = new mongoose.Schema({
    videoUrl:String,
    videoThumbanail:Object,
    title:String,
    videoSection:String,
    descripition:String,
    videoLength:Number,
    videoPlayer:String,
    links:[linkSchema],
    suggestion:String,
    question:[commrntSchema],
})


const courseSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    descripition:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    estimatedPrice:{
        type:Number
    },
    thumbnail:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,  
        },
    },
    tags:{
        type:String,
        required:true,
    },
    level:{
        type:String,
        required:true,
    },
    demoUrl:{
        type:String,
        required:true,
    },
    benefits:[{title:String}],
    prerequisites:[{title:String}],
    reviews:[reviewSchema],
    courseData:[courseDataSchema],
    rating:{
        type:Number,
        required:true,
    },
    purchased:{
        type:Number,
        default:0
    }
})

const courseModal = mongoose.model("Course",courseSchema)

export default courseModal