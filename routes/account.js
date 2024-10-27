const { Router } = require("express");
const authMiddleware = require("../middleware/middleware");
const { Account } = require("../db");
const { boolean } = require("zod");
const router = Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });
    console.log("userId", userId)
    res.json({
        balance: account.balance
    })
});

module.exports = router;