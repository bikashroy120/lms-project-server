import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: String,
    reviewReplay:[Object]
})


const linkSchema = new mongoose.Schema({
    title: String,
    url: String,
})

const commrntSchema = new mongoose.Schema({
    user: Object,
    question: String,
    questionReples: [Object]
})

const courseDataSchema = new mongoose.Schema({
    videoUrl: String,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    question: [commrntSchema],
})


const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number
    },
    thumbnail: {
        type: String,
        required: true,
    },
    tags: [String],
    level: {
        type: String,
        required: true,
    },
    demoUrl: {
        type: String,
        required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    rating: {
        type: Number,
        default: 0
    },
    purchased: {
        type: Number,
        default: 0
    }
})

const courseModal = mongoose.model("Course", courseSchema)

export default courseModal