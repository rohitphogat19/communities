const mongoose = require('mongoose')
const User = require("./User")

const Schema = mongoose.Schema;

const CommunitySchema = new Schema(
    {
        title: {
            type: String,
            unique: false,
            required: true
        },
        description: {
            type: String,
            unique: false,
            required: true
        },
        profileImage: {
            type: String,
            unique: false,
            required: false
        },
        coverImage: {
            type: String,
            unique: false,
            required: false
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "Users"
        },
        members: {
            type: [String],
            default: []
        },
        admins: {
            type: [String],
            default: []
        },
        isEditableByAnyone: {
            type: Boolean,
            required: false,
            default: false
        },
        privacyType: {
            type: String,
            enum: ["public", "private"],
            default: "public",
            required: false,
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Community', CommunitySchema)