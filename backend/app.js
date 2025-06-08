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
const routes = require('./routes');

app.use(routes);





// exports
module.exports = app;