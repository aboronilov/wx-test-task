import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    imgURL: {
        type: String,
        defualt: ""
    },
    views: {
        type: Number,
        default: 0,
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    comments: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comment"
    }
}, {timestamps: true})

export const Post = mongoose.model("Post", PostSchema)