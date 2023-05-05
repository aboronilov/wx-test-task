import express from "express";

import auth from "./auth"
import post from "./post"

const router = express.Router();

export default (): express.Router => {
    auth(router)
    post(router)
    return router;
 }