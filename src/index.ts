import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from 'dotenv';

import router from "./router"

const app = express()
dotenv.config()

// middleware
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())


// routing
app.use("/api", router())

// constants
const port = process.env.PORT || 8000

const start = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI)
      app.listen(port, () => console.log(`Server is running on ${port} port...`))
   } catch (error) {
      console.log(error.message)
   }
}

start()

