require('dotenv').config()
// Import Packages
const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
const cors = require("cors")
// Import modules in files
const { connectToDB } = require('./services/db')

// Import routes
const authRoute = require("../src/routes/authentication_route")
const postRoute = require("../src/routes/post_route")

// Initialize App
const app = express()


// Connect Database
connectToDB()


// Middleware
// Note: Always place your middleware before your routes.
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())


//  Save current user in session
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

// Use Routes
app.use(authRoute)
app.use(postRoute)

module.exports = app