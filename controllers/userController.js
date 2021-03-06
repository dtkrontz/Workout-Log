const router = require("express").Router();
const {UserModel} = require("../models");
const {UniqueConstraintError} = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// CREATE NEW USER

router.post("/register", async (req, res) => {
    let {username, password} = req.body.user;
    try {
        console.log(username, password, bcrypt.hashSync(password, 15));
        
        const User = await UserModel.create({
            username: username,
            passwordhash: bcrypt.hashSync(password, 15)
        });
        console.log(jwt.sign({id: User.id}, process.env.JWT_SECRET,{expiresIn: 60 * 60 * 24}));
        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET,{expiresIn: 60 * 60 * 24});

        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        console.log (err);
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username alreay in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to register user",
            });
        }
    }
});

// LOG IN WITH AN EXISTING USER

router.post("/login", async (req, res) => {
    let {username, password} = req.body.user;

    try {
        let loginUser = await UserModel.findOne({
            where: {
                username: username,
            },
        });
        if (loginUser) {

            let passwordComparison = await bcrypt.compare(password, loginUser.passwordhash);

            if (passwordComparison) {

            let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

            res.status(200).json({
                user: loginUser,
                message: "User successfully logged in!",
                sessionToken: token
            });
        } else {
            res.status(401).json({
                message: "Incorrect email or password"
            })
        }
        
        } else {
            res.status(401).json({
                message: "Incorrect email or password"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});


module.exports = router;