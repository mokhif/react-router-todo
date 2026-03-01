import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
dotenv.config();
const app = express();
const port = 5000;
console.log(process.env.MONGODB_URI)
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

await mongoose.connect(process.env.MONGODB_URI);
console.log("connected to mongodb");
app.listen(port, () => console.log(`server is running on port:${port}`));
