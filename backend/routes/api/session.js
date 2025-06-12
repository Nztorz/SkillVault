const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// validatelogin middleware
const validatelogin = [
    check("userName")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Please provide a valid or username"),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a password."),
    handleValidationErrors
]

// POST /api/session/
// login
router.post("/", validatelogin, async (req, res, next) => {
    // req.body
    // user can enter
    // either username or email
    const { userName, password } = req.body;
    
    // look for the user
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
            username: userName,
            email: userName
        }
      }
    });

    // verify the password
    const correctPassword = bcrypt.compareSync(password, user.hashedPassword);

    // when found verify the password
        // when the password doesn't match
        // when the user is not found
        // invoke the "Login failed" error
    if(!user || !correctPassword) {
        const error = new Error("Login Failed");
        error.status = 401;
        error.title = "Login failed";
        error.errors = { credential: "Provided credentials are invalid."}
        return next(error);
    };
    
    // when all match, call setTokenCookie
    // return a json response with user non-sensitive data
    /* 
    {
        user: {
            id, email, username
        }
    }
    */
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username
   };

   await setTokenCookie(res, safeUser);

   return res.json({
    user: safeUser
   });
})

// DELETE /api/session
// logout
router.delete("/", (req, res) => {
    res.clearCookie("token");
    return res.json({message: "success"});
});

// GET /api/session
router.get("/", (req, res) => {
    const { user } = req;

    if(user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        return res.json({user: safeUser});
    }

    return res.json({user: null});
});

module.exports = router;