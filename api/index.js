const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes")

const app = express();
dotenv.config();

//app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRoutes);

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => { console.log("Connected to DataBase Successfully"); })
    .catch((error) => { console.log(error); });

app.listen(
    process.env.PORT_NUMBER,
    () => { console.log(`Example app listening on port ${process.env.PORT_NUMBER}!`) }
);