const { Router } = require("express");
const router = Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware/middleware")
const bcrypt = require("bcrypt");

const signupBody = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

router.post("/signup", async(req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if(!success) {
        return res.status(411).json({
            msg: "Email already taken / Incorrect input"
        })
    }
    
    try {
        const existingUser = await User.findOne({
            username: req.body.username
        })
    
        if(existingUser) {
            return res.status(411).json({
                msg: "Email already taken / Incorrect input"
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })
    
        const userId = user._id;

        const b = await Account.create({
            userId,
            balance: 1 + Math.random() * 1000
        })
        console.log(b)
        
        const token = jwt.sign({
            userId
        }, JWT_SECRET);
        
        res.json({
            msg: "User Created successfully",
            token: token
        })
        console.log(`New user created successfully ${user}`)
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                msg: "Validation error: Username must be between 4 and 20 characters",
                error: error.name
            })
        } else {
            console.log("some error")
            return res.status(500).json({
                msg: "server error"
            })
        }      
    }
})

const signinBody = zod.object({
    username: zod.string(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if(!success) {
        return res.status(411).json({
            mag: "Incorrect Inputs"
        });
    }
    
    const user = await User.findOne({
        username: req.body.username,
    });

    if(user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        res.json({
            msg: "User Sign In successfully",
            token: token
        })
    } else {
        res.status(411).json({
            msg: "Error while logging in"
        })
    }
})

// const updateBody = zod.object({
//     password: zod.string().optional(),
//     firstName: zod.string().optional(),
//     lastName: zod.string().optional()
// })

// router.put("/", authMiddleware, async (req, res) => {
//     const { success } = updateBody.safeParse(req.body)
//     if(!success) {
//         res.status(411).json({
//             msg: "Error while updating information"
//         })
//     }

//     try {
//         await User.updateOne({ _id: req.userId }, req.body);

//         res.json({
//             msg: "Updataed Successfully"
//         });
//     } catch (error) {
//         console.log(`Upadate error: ${error}`)
//         res.status(500).json({
//             msg: "Server error while Updating"
//         });
//     }
// });

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router