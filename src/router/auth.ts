import express from "express";
import {register, login, getMe} from "../controllers/authentication"
import { checkAuth } from "../utils";

export default (router: express.Router) => {
    router.post("/auth/register/", register)
    router.post("/auth/login", login)
    router.get("/auth/me", checkAuth, getMe)
}