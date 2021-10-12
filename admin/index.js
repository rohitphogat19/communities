const express = require("express");
const multer = require('multer');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/profiles/users', express.static('profiles/users'))

app.listen(8802, console.log("Listening on Port 8802"),);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'profiles/users')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '_' + uniqueSuffix + '.' + ext)
    }
})

const uploadImg = multer({ storage: storage }).single('image');

app.post("/check", function (req, res) {
    res.status(200).json("Ok");
})

app.post("/updateprofileimage", function (req, res) {
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

        res.status(200).json({ path: req.file.filename });
    })
})