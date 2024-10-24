const mongoose = require("mongoose");
const { number } = require("zod");

mongoose.connect("URL");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLenght: 4,
        maxLenght: 6
    },
    password: {
        type: String,
        required: true,
        minLenght: 6
    },
    firstName: {
        type: String,
        required: true,
        maxLenght: 50
    },
    lastName: {
        type: String,
        required: true,
        maxLenght: 50
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // refference to the user model
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true,
    }
})

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
    User,
    Account
}