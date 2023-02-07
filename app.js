const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieparser = require("cookie-parser");
const postRoute = require("./router/posts");
const userRoute = require("./router/users");
const axios = require("axios");

dotenv.config({ path: "./config.env" });
require("./db/conn");
app.use(express.json());
app.use(cookieparser());
const PORT = process.env.PORT || 1337;
console.log(process.env.PORT);
const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};

app.use(cors(corsOptions));
app.use(require("./router/auth"));
app.use("/posts", postRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.json("HELLO");
});

app.get("/home", (req, res) => {
  res.cookie("Test", "something");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});

// http://localhost:1337/hello