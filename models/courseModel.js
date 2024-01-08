import mongoose from "mongoose";


const reviewReplaySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    answer:String
},{timestamps:true})

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    rating: {
        type: Number,
        default: 0
    },
    comment: String,
    reviewReplay:[reviewReplaySchema]
},{timestamps:true})


const linkSchema = new mongoose.Schema({
    title: String,
    url: String,
})

const questionReplaySchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    answer:String,
},{timestamps:true})

const commentSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    question: String,
    questionReplay: [questionReplaySchema]
},{timestamps:true})


const courseDataSchema = new mongoose.Schema({
    videoUrl: String,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    question: [commentSchema],
},{timestamps:true})


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
    category:{
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
},{timestamps:true})


// Populate the 'user' field in commrntSchema
// courseSchema.pre("find", function (next) {
//     this.populate("reviews.user");
//     this.populate("courseData.question.user");
//     next();
// });


const courseModal = mongoose.model("Course", courseSchema)

export default courseModal