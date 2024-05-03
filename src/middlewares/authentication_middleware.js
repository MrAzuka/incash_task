const jwt = require('jsonwebtoken');
const User = require('../models/user_model');

exports.checkIfLoggedIn = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return next(res.status(401).send({ success: false, message: "Authentication is Required" }));
        }
        if (!String(authorization).startsWith('Bearer')) {
            return next(res.status(400).send({ success: false, message: "Please use bearer token" }));
        }

        const [bearer, token] = authorization.split(' ');
        // verify the token and verify if user is logged in in or not
        // If user is logged in then call the next() function to go to the next middleware

        const verifyNewToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!verifyNewToken) {
            return res.status(401).send({
                success: false,
                message: "Authorization error, Please Login",
            });
        }

        req.token = verifyNewToken;
        req.user = verifyNewToken;

        next();
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: "Token is invalid or has expired",
        });
    }
};

exports.checkIfRoleisAuthor = async (req, res, next) => {
    try {
        const { userEmail } = req.user

        const user = await User.findOne({ email: userEmail })

        if (!user) {
            return res.status(300).send({
                success: true,
                message: "User not found"
            })
        }

        if (user.role === "author") {
            next()
        } else {
            return res.status(400).send({
                success: true,
                message: "Unauthorized access, Authors only"
            })
        }
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: "Token is invalid or has expired",
        });
    }
}

exports.checkIfRoleisAdmin = async (req, res, next) => {
    try {
        const { userEmail } = req.user

        const user = await User.findOne({ email: userEmail })

        if (!user) {
            return res.status(300).send({
                success: true,
                message: "User not found"
            })
        }

        if (user.role === "admin") {
            next()
        } else {
            return res.status(400).send({
                success: true,
                message: "Unauthorized access, Admin only"
            })
        }
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: "Token is invalid or has expired",
        });
    }
}