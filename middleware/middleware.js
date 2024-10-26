const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function authMiddleware(req, res, next) {
    const authToken = req.headers.authorization;

    if(!authToken || !authToken.startsWith("Bearer")) {
        return res.status(403).json({});
    }

    const Token = authToken.split("")[1];

    try {
        const decoded = jwt.verify(Token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({
            msg: "authorization failed"
        })
    }
}

module.exports = authMiddleware;