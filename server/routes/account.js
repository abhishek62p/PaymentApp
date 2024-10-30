const { Router } = require("express");
const authMiddleware = require("../middleware/middleware");
const { Account } = require("../db");
const mongoose = require("mongoose");
const router = Router();

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({
            userId: req.userId
        });

        console.log(`your account is: ${account}`);
        if(!account) {
            console.log(`No account fount for userId: ${req.userId}`);
            return res.status(404).json({
                error: "Account not found"
            });
        }

        res.json({
            balance: account.balance
        });
        console.log(`your account balance is: ${account.balance}`);
    } catch (error) {
        console.log(`Error fetching balance: ${error}`);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Insufficient Balance" });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Invalid Account" });
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.json({ msg: "Transfer Successful" });
    } catch (error) {
        console.error(`Error in transfer: ${error}`);
        await session.abortTransaction();
        res.status(500).json({ error: "Internal server error" });
    } finally {
        session.endSession();
    }
});

module.exports = router;