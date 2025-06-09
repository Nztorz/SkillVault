// setup the route
const express = require('express');
const router = express.Router();

router.get('/api/csrf/restore', (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    })
})

// import the router api 
const apiRouter = require('./api');
// mount the router
router.use('/api', apiRouter);

module.exports = router;