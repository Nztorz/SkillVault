const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// check the environment setup
const { environment } = require('./config');
const isProduction = environment === "production";

// initialize the express app
const app = express();

// morgan middleware
app.use(morgan('dev'));

// cookie parse middleware and JSON bodies
app.use(cookieParser());
app.use(express.json());

// allow cors for development
if(!isProduction) {
    app.use(cors());
}

// set helmet 
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
)

// set csrf token and create req.csrfToken
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
)

// routes
const routes = require('./routes/index');
const { ValidationError } = require('sequelize');
app.use(routes);


// error handlers
// 404 error
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = {message: "The requested resource couldn't be found."};
    err.status = 404;
    next(err);
});

// process sequelize errors
app.use((err, _req, _res, next) => {
    // sequelize error?
    if(err instanceof ValidationError) {
        let errors = {};
        for(let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = "Validation error";
        err.errors = errors;
    }
    next(err);
});

// formating errors
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || "Server Error",
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
})


// exports
module.exports = app;