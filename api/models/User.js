const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            unique: true
        },
        userName: {
            type: String,
            required: true,
            unique: true
        },
        rtcId: {
            type: Number,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            required: false,
            unique: false
        },
        lastName: {
            type: String,
            required: false,
            unique: false
        },
        isVerified: {
            type: Boolean,
            required: false,
            unique: false,
            default: false,
        },
        isProfileSet: {
            type: Boolean,
            required: false,
            unique: false,
            default: false,
        },
        isOnline: {
            type: Boolean,
            required: false,
            unique: false,
            default: false
        },
        isNotificationsOn: {
            type: Boolean,
            required: false,
            unique: false,
            default: false,
        },
        profileImageUrl: {
            type: String,
            required: false,
            unique: false
        },
        isSocialLogin: {
            type: Boolean,
            required: false,
            unique: false,
            default: false,
        }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Users', UserSchema)