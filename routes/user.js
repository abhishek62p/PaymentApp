const { Router } = require("express");
const router = Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware/middleware")

const signupBody = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

router.post("/signup", async(req, res) => {
    const { success } = signupBody.safeParse(req.body)
    console.log(req.body)
    console.log("hi there")   //  adding log for debugging
    if(!success) {
        return res.status(411).json({
            msg: "Email already taken / Incorrect input"
        })
    }
    console.log("hi there 1")
    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser) {
        return res.status(411).json({
            msg: "Email already taken / Incorrect input"
        })
    }

    console.log("hi there 2")
    const user = await User.create({
        username: req.body.username,
        passsword: req.body.passsword,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    console.log("hi there 3")  // adding log for debugging 
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        msg: "User Created successfully",
        token: token
    })

})

const signinBody = zod.object({
    username: zod.string().email(),
    passsword: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    console.log(" hi 1")
    if(!success) {
        return res.status(411).json({
            mag: "Incorrect Inputs"
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.passsword
    });

    if(user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        res.json({
            token: token
        })
        return;
    }
    res.status(411).json({
        msg: "Error while logging in"
    })

})

const updateBody = zod.object({
    passsword: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

// router.put("/", authMiddleware, async (req, res) => {
//     const { success } = updateBody.safeParse(req.body)
//     if(!success) {
//         res.status(411).json({
//             msg: "Error while updating information"
//         })
//     }

//     await User.updateOne({ _id: req.userId }, req.body);

//     res.json({
//         mag: "Updateed Successfully"
//     })
// })

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