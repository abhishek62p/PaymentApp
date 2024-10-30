const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function authMiddleware(req, res, next) {
    const authToken = req.headers.authorization;

    if(!authToken || !authToken.startsWith("Bearer")) {
        return res.status(403).json({
            msg: "Authorization token missing or malformed"
        });
    }

    const Token = authToken.split(" ")[1];
    console.log(`Token received: ${Token}`);

    try {
        const decoded = jwt.verify(Token, JWT_SECRET);
        console.log(`Decoded userId: ${decoded.userId}`);
        req.userId = decoded.userId;
        console.log("hi", req.userId);
        next();
    } catch (error) {
        console.log(`Token verification failed: ${error.message}`)
        return res.status(403).json({
            msg: "Authorization failed"
        })
    }
}

module.exports = authMiddleware;