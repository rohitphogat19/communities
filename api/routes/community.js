const router = require('express').Router()
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra')

const Image = require("../models/FileSchema");
const User = require("../models/User");
const Community = require("../models/Community")
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyJWT')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dirPath = path.join(__dirname, "../../../media/profiles/communities");
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

router.post("/create", verifyToken, async function (req, res) {
    var userId = res.tokenVerification.id;
    const title = req.body.title;
    var privacy = req.body.privacy;
    var isEditable = req.body.isEditable;

    if (!title || title === "") {
        return res.status(400).json({
            message: 'Please Provide Title For Community',
            errorCode: 'COMMUNITY_NAME_MISSING',
        })
    }

    if (!privacy) privacy = "public";

    if (!isEditable) isEditable = false;

    try {
        const newCommunity = new Community({
            title: title,
            description: "Description",
            profileImage: "",
            owner: userId,
            members: [userId],
            admins: [userId],
            isEditableByAnyone: isEditable,
            privacyType: privacy
        })

        const savedCommunity = await newCommunity.save();
        await savedCommunity.populate('owner', {
            firstName: 1,
            lastName: 1,
            isVerified: 1,
            userName: 1,
            profileImageUrl: 1,
            isOnline: 1
        });
        res.status(201).json(savedCommunity._doc)

    } catch (error) {
        console.log(error);
    }
})

router.post("/:id/updateprofileimage", verifyToken, async function (req, res) {
    var userId = res.tokenVerification.id;
    var communityId = req.params.id;
    try {
        Community.findById(communityId, async function (error, docs) {
            if (error) {
                return res.status(404).json({
                    message: 'Invalid Community ID',
                    errorCode: 'INVALID_COMMUNITY_ID',
                })
            }
            var admins = docs.admins

            if (!admins.includes(userId)) {
                return res.status(401).json({
                    message: 'You are not allowed to perform this operation.',
                    errorCode: 'UNAUTHORIZED_OPERATION',
                })
            }

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
                var fullMediaUrl = process.env.MEDIA_SERVER_URL + "/profiles/communities/" + req.file.filename
                req.body.profileImage = fullMediaUrl;
                docs.profileImage = fullMediaUrl;
                await docs.save();
                res.status(200).json({ url: fullMediaUrl });
            })
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
