const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")


exports.userRegister = async (req, res) => {
    try {
        const {
            username,
            email,
            password
        } = req.body;
        // Check if Author exists
        const checkUser = await User.findOne({
            email,
        });
        if (checkUser) {
            return res.status(302).send({
                success: false,
                message: "Email already registered",
            });
        }

        await User.create({
            username,
            email,
            password,
        });

        return res.status(201).send({
            success: true,
            message: "User Registered Successfully"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        });
    }
};

exports.userLogin = async (req, res) => {
    try {
        const {
            userID, // user can login with either username or email
            password
        } = req.body;

        //check that email and password were sent
        if (!userID && !password) {
            return res.status(400).send({
                message: "login details are required"
            });
        }

        //check that user exists
        const user = await (User.findOne({
            email: userID
        }).select("+password")) || await (User.findOne({
            username: userID
        }).select("+password"))

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        //check that the passwords match
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password"
            });
        }
        let id = user._id
        let userEmail = user.email
        let username = user.username
        //generate an jwt token for the user.
        const userToken = jwt.sign({ id, userEmail, username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES,
        });

        res.status(200).send({
            success: true,
            message: "User is logged in",
            userToken,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        });
    }
};

// Password reset
exports.forgetUserPassword = async (req, res) => {
    try {
        const {
            email
        } = req.body;
        if (!email) {
            return res.status(406).json({
                message: "Not Vaild Email",
            });
        }

        // check if email is registered
        let user = await User.findOne({
            email: email,
        });
        if (!user) {
            return res.status(404).json({
                message: "Email Not Found",
            });
        }

        const token = crypto.randomBytes(25).toString("hex");
        user.passwordResetToken = token;
        user.tokenExpiryTime = Date.now() + 900000; //present time plus 15mis
        user = await user.save();

        res.status(200).send({
            success: true,
            message: "Reset Mail Sent",
            token: token
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
        });
    }
};

exports.resetUserPassword = async (req, res) => {
    try {
        const {
            token
        } = req.params;
        const {
            password
        } = req.body
        let user = await User.findOne({
            passwordResetToken: token
        });

        if (!user) {
            return res.status(300).send({
                success: true,
                message: "User not found"
            })
        }

        const newPassword = await bcrypt.hash(password, 12)

        // update password
        await User.findOneAndUpdate({ passwordResetToken: token }, {
            password: newPassword,
            passwordResetToken: null,
            tokenExpiryTime: null
        }, { new: true })

        res.status(200).send({
            success: true,
            message: "Password reset"
        })
    } catch (error) {

        res.status(500).send({
            success: false,
            error
        })
    }
}

exports.changeRolesToAuthor = async (req, res) => {
    try {
        const { userEmail } = req.user
        // check if user exist
        let user = await User.findOne({
            email: userEmail
        });

        if (!user) {
            return res.status(300).send({
                success: true,
                message: "User not found"
            })
        }

        await User.findOneAndUpdate({ email: userEmail }, { role: "author" }, { new: true })

        return res.status(200).send({
            success: true,
            message: "User role updated"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error
        })
    }
}