const router = require('express').Router()
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra')

const Image = require("../models/FileSchema");
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyJWT')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dirPath = path.join(__dirname, "../../../media/profiles/users");
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        cb(null, dirPath)
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '_' + uniqueSuffix + "_" + uuidv4() + '.' + ext)
    }
})

const uploadImg = multer({ storage: storage }).single('image');

router.put(
    '/:id/updateProfile',
    verifyTokenAndAuthorization,
    async (req, res) => {
        req.body.isProfileSet = true;
        try {
            const updatingUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true, },
            );
            const { password, ...others } = updatingUser._doc
            res.status(201).json(others)
        } catch (error) {
            res.status(500).json(error)
        }
    },
)

router.post("/updateprofileimage", verifyToken, function (req, res) {
    var userId = res.tokenVerification.id;
    uploadImg(req, res, async function (error) {
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
        var fullMediaUrl = process.env.MEDIA_SERVER_URL + "/media/profiles/users/" + req.file.filename
        req.body.profileImageUrl = fullMediaUrl;
        try {
            await User.findByIdAndUpdate(userId, { $set: req.body }, { new: true });
            res.status(201).json({ url: fullMediaUrl })
        } catch (error) {
            res.status(500).json(error)
        }
    })
})

module.exports = router;