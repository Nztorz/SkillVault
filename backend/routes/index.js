// setup the route
const router = require('express').Router();
const sessionRouter = require("./api/session");
const usersRouter = require("./api/users");
const { restoreUser } = require("../utils/auth")


router.use(restoreUser);
router.use("/api/session", sessionRouter);
router.use("/api/users", usersRouter);

router.get('/api/csrf/restore', (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    })
})

router.post("/test", (req, res) => {
    res.json({ requestBody: req.body });
})

module.exports = router;