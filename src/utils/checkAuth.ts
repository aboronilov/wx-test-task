import jwt from "jsonwebtoken"
import express from "express"
import { CustomRequest, Decoded } from "../types"

export const checkAuth = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
    const accessToken = req.cookies["accessToken"]
    if (!accessToken) {
        return res.status(403).json({msg: "No token is provided"})
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET) as Decoded
        if (!decoded) {
            return res.status(403).json({msg: "Authentictaion failed"})
        }
    
        req.userId = decoded.id 
        next()        
    } catch (error) {
        return res.status(403).json({msg: "Access restricted"})
    }
}