import express from "express"
import { User } from "../models"
import { CustomRequest } from "../types"

export const isOwner = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
    const {userId} = req
    if (!userId) {
        return res.status(403).json("Authentication failed")
    }

    const user = await User.findById(userId)
    const {id: postId} = req.params
    if (!user.posts.includes(postId as any)) {
        return res.status(403).json("You are not the owner of this item")
    }

    next()
}