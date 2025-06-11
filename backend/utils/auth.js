const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// User Auth Middleware
// sends a JWT cookie
const setTokenCookie = (res, user) => {
    // create the token
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) }
    );

    const isProduction = process.env.NODE_ENV === "production";

    // set the token cookie
    res.cookie("token", token, {
        maxAge: expiresIn * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
}

// restore user session sabed on JWT cookie
const restoreUser = (req, res, next) => {
    // get the token from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if(err) {
           return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ["email", "createdAt", "updatedAt"]
                }
            });
        } catch(err) {
            res.clearCookie("token");
            return next();
        }

        if(!req.user) res.clearCookie("token");

        return next();
    })
}

// requireAuth
// check the user for a session
const requireAuth = (req, _res, next) => {
    if(req.user) next();

    const err = new Error("Authentication required");
    err.title = "Authentication required";
    err.errors = { message: "Authentication required" };
    err.status = 401;
    return next(err);
}


module.exports = {
    setTokenCookie,
    restoreUser,
    requireAuth
};