const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")

const app = express();
dotenv.config();

//app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes)
//app.use('../media/profiles/users', express.static('../media/profiles/users'))

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => { console.log("Connected to DataBase Successfully"); })
    .catch((error) => { console.log(error); });

app.listen(
    process.env.PORT_NUMBER,
    () => { console.log(`Example app listening on port ${process.env.PORT_NUMBER}!`) }
);