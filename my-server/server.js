import express from "express";
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.listen(port, () => console.log(`server is running on port:${port}`));
