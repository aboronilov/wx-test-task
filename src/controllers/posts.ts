import express from "express"
import { Post, User } from "../models"
import { CustomRequest } from "../types"
import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_APP_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const createPost = async(req: CustomRequest, res: express.Response) => {
    try {
        const {title, content, photo} = req.body;
        if (!title || !content) {
            return res.status(400).json({msg: "Please provide title and content"})
        }
        const user = await User.findById(req.userId);
        const photoUrl = photo ? await cloudinary.uploader.upload(photo) : null;

        // start transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        const newPost = await Post.create({
            username: user.username,
            title,
            content,
            imgURL: photoUrl ? photoUrl.secure_url : "",
            author: req.userId
        })

        user.posts.push(newPost._id)
        await user.save({session})

        // end transaction
        await session.commitTransaction();

        return res.status(201).json({
            msg: "Post sucessfully created",
            newPost
        })

    } catch (error: any) {
        console.log(`Create post error - ${error.message}`);
        return res.status(500).json({msg: error.message});
    }
}

export const updatePost = async(req: CustomRequest, res: express.Response) => {
    try {
        const {id} = req.params
        const {title, content, photo} = req.body
        const photoUrl = photo ? await cloudinary.uploader.upload(photo) : null;

        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({msg: `Post with id ${id} not found`})
        }

        if (title) {
            post.title = title
        }
        if (content) {
            post.content = content
        }
        if (photoUrl) {
            post.imgURL = photoUrl.secure_url
        }
        await post.save()

        return res.status(200).json({
            msg: "Post successfully updated", 
            post
        })
    } catch (error: any) {
        console.log(`Update post error - ${error.message}`);
        return res.status(500).json({msg: error.message});
    }
}

export const getPosts = async(req: CustomRequest, res: express.Response) => {
    try {
        // pagination
        const page = req.query.page ? Number(req.query.page) : 1
        const limit = req.query.limit ? Number(req.query.limit) : 20
        const skip = (page - 1)* limit

        // posts
        const posts = await Post.find().sort("-createdAt").skip(skip).limit(limit)
        return res.status(200).json({
            page,
            limit,
            posts
        })
    } catch (error: any) {
        console.log(`Create post error - ${error.message}`);
        return res.status(500).json({msg: error.message});
    }
}

export const getMyPosts = async(req: CustomRequest, res: express.Response) => {
    try {
        const posts = await Post.find({author: req.userId}).sort("-createdAt")
        return res.status(200).json({posts})
    } catch (error: any) {
        console.log(`Create post error - ${error.message}`);
        return res.status(500).json({msg: error.message});
    }
}

export const getPost = async(req: CustomRequest, res: express.Response) => {
    try {
        const {id} = req.params
        const post = await Post.findOneAndUpdate({_id: id}, {
            $inc: {views: 1}
        }
            )
        if (!post) {
            return res.status(404).json({msg: `Post with id ${id} not found`})
        }

        return res.status(200).json({
            msg: "Post successfully found",
            post
        })
    } catch (error: any) {
        console.log(`Get all posts error - ${error.message}`);
        return res.status(500).json({msg: error.message});
    }
}

export const deletePost = async(req: CustomRequest, res: express.Response) => {
    try {
        const {id} = req.params;
        const post = await Post.findByIdAndDelete(id)
        if (!post) {
            return res.status(404).json("No post found")
        }

        await User.findByIdAndUpdate(id, {
            $pull: {posts: id}
        })

        return res.status(200).json({msg: "Post successfully deleted"})
    } catch (error: any) {
        console.log(`Delete post error - ${error.message}`);
        return res.status(500).json({msg: error.message});
    }
}