const router = require('express').Router()
const multer = require('multer');
const path = require('path');

const Image = require("../models/FileSchema");
const User = require("../models/User");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dirPath = path.join(__dirname, "../../media/profiles/users");
        cb(null, dirPath)
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '_' + uniqueSuffix + '.' + ext)
    }
})

const uploadImg = multer({ storage: storage }).single('image');

router.post("/updateprofileimage", function (req, res) {
    uploadImg(req, res, function (error) {
        if (error instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({ message: error.message, errorCode: error.code });
        } else if (error) {
            if (error.code === "ENOENT") {
                return res.status(400).json({ message: "No such file or directory", errorCode: "ENOENT" })
            } else {
                return res.status(400).json(error);
            }
        }

        var fullMediaUrl = mediaFolderPath + req.file.filename

        res.status(200).json({ path: fullMediaUrl });
    })
})

module.exports = router;