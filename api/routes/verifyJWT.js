const jwt = require("jsonwebtoken");

const verifyToken = (request, response, next) => {
    const headerToken = request.headers.token;
    if (headerToken) {
        jwt.verify(headerToken, process.env.JWT_SEC_KEY, (error, verificationResult) => {
            if (error) {
                response.status(403).json({
                    message: "Invalid Authentication Token",
                    errorCode: "INVALID_TOKEN"
                })
            } else {
                response.tokenVerification = verificationResult;
                next();
            }
        });
    } else {
        response.status(403).json({
            message: "User is not authorised for this request",
            errorCode: "NOT_AUTHORIZED"
        });
    }
}

const verifyTokenAndAuthorization = (originalRequest, verificationResponse, next) => {
    verifyToken(originalRequest, verificationResponse, () => {
        if (verificationResponse.tokenVerification.id === originalRequest.params.id) {
            next();
        } else {
            originalRequest.status(403).json({
                message: "User is not authorised for this request",
                errorCode: "NOT_AUTHORIZED"
            });
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization }