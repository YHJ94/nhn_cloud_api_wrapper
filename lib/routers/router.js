var express = require('express');
var instanceService = require('./instanceService');

var router = express.Router();

router.use((req, res, next) => {

    var reqPath = req.path;
    var reqData = req.data;

    console.log("Called : ", req.path);
    next();
})

router.use(instanceService);

module.exports = router;