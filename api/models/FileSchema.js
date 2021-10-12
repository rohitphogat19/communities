// Calling the "mongoose" package
const mongoose = require("mongoose");

// Creating a Schema for uploaded files
const imageFileSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        required: [true, "Uploaded file must have a name"],
    },
});

// Creating a Model from that Schema
const Image = mongoose.model("Image", imageFileSchema);

// Exporting the Model to use it in app.js File.
module.exports = Image;