const router = require('express').Router()
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const e = require('express')
const User = require('../models/User')
const emailValidator = require('email-validator');

router.post('/register', async (request, response) => {
    const requestMail = request.body.email
    const requestPassword = request.body.password

    if (
        !requestMail ||
        requestMail === '' ||
        !requestPassword ||
        requestPassword === ''
    ) {
        return response.status(400).json({
            message: 'Please Provide Valid Credentials',
            code: 'CREDENTIALS_INCOMPLETE',
        })
    }

    if (!emailValidator.validate(requestMail)) {
        return response.status(400).json({
            message: 'Please Provide Valid Email Address',
            code: 'INVALID_EMAIL_ADDRESS',
        })
    }

    if (requestPassword.length < 8) {
        return response.status(400).json({
            message: 'Please enter password more than or equal to 8 characters',
            code: 'PASSWORD_LENGTH_SHORT',
        })
    }

    const lowercasedMail = requestMail.toLowerCase();
    var emailParts = lowercasedMail.split("@");
    var userName = emailParts.length == 2 ? emailParts[0] : null;

    const randomRtcUserId = await getUniqueRtcUserId()

    try {
        User.findOne({ email: lowercasedMail }, async (error, user) => {
            if (user) {
                return response
                    .status(404)
                    .json({
                        errorCode: 'EMAIL_ALREADY_EXIST',
                        message: 'User Already Exist With this Email Address',
                    })
            } else {
                const newUser = new User({
                    email: lowercasedMail,
                    password: CryptoJS.AES.encrypt(
                        requestPassword,
                        process.env.PASS_AES_SEC_KEY,
                    ),
                    userName: userName,
                    rtcId: randomRtcUserId,
                })

                const savedUser = await newUser.save()

                const accessToken = jwt.sign(
                    {
                        id: savedUser.id,
                    },
                    process.env.JWT_SEC_KEY,
                )

                const { password, ...others } = savedUser._doc
                response.status(201).json({ ...others, accessToken })
            }
        })
    } catch (error) {
        response.status(500).json(err)
    }
})

const getUniqueRtcUserId = async () => {
    const randomRtcUserId = between(200000, 9900000)
    console.log(randomRtcUserId);
    try {
        var user = await User.findOne({ rtcId: randomRtcUserId })
        console.log(user._doc);
        await getUniqueRtcUserId()
    } catch (error) {
        return randomRtcUserId
    }
}

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

module.exports = router;
