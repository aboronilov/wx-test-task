import express from "express"

import {
    createPost,
    updatePost,
    getPosts,
    getPost,
    deletePost,
    getMyPosts
} from "../controllers/posts"
import { checkAuth, isOwner } from "../utils"

export default (router: express.Router) => {
    router.post("/posts", checkAuth, createPost)
    router.put("/posts/:id", checkAuth, isOwner, updatePost)
    router.get("/posts", getPosts)
    router.get("/posts/users/me", checkAuth, getMyPosts)
    router.get("/posts/:id", getPost)
    router.delete("/posts/:id", checkAuth, isOwner, deletePost)
}