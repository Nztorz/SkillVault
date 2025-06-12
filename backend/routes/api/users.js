const router = require("express").Router();
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateSignup = [
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please provide a valid email."),
    check("username")
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage("Please provide a username with at least 3 characters"),
    check("username")
        .not()
        .isEmail()
        .withMessage("Username cannot be an email."),
    check("password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password must be 6 characters or more."),
    handleValidationErrors
];


// POST /api/users/
// signup users
router.post("/", validateSignup, async (req, res, next) => {
    // deconstruct the req.body
    const { email, username, password } = req.body;

    // salt and hash the password
    const hashedPassword = bcrypt.hashSync(password);

    // create the new user
    // username, email, hashedPassword
    const newUser = await User.create({
        username: username,
        email: email,
        hashedPassword: hashedPassword
    });

    // use setTokenCookie
    const safeUser = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
    };

    await setTokenCookie(res, safeUser);

    // response
    //  {
    //   user: {
    //     id,
    //     email,
    //     username
    //   }
    // }
    return res.json({user: safeUser});
})



module.exports = router;