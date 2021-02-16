import express from "express";
import dotenv from "dotenv";
import userRoutes from "../backend/routes/userRoutes.js"

//load environment variables
dotenv.config();

const app = express();

//body parser
app.use(express.json())

app.get("/", (req, res) => res.send("hello from express"));
//Route files
app.use("/api/users", userRoutes)
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold.underline);
})