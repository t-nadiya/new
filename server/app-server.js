const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const authRoutes = require("./routes/auth");

mongoose
  .connect(keys.mongoURI)
  .then(() => console.log("MongDB connected"))
  .catch((err) => console.log(err));

// create app express server
const app = express();

// // init parse body to json for POST
// // вариант от Васи
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// вариант из урока
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api", authRoutes);

module.exports = app;

// //не работает nodemon
// // nodemon добавляется в dependencies, а не девДependencies
// // ts-node установила для nodemon
// // команда npm run server не работает
