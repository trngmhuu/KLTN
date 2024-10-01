import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import color from "colors"

dotenv.config()
const app = express()
const port = process.env.PORT

// database connection
mongoose.set("strictQuery", false);
const connect = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(color.green.bold("MongoDB connected"));
    }
    catch (error) {
        console.log(color.red.bold(error))
    }
}

// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.listen(port, () => {
    connect();
    console.log(color.yellow.bold("Server is running on port", port));
})
