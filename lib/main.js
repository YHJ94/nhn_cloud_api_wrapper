// dependency node moudules
var express = require('express');
var bodyParser = require('body-parser');

// 메인 서비스 라우터 entry point
var router = require('./routers/router');

// Express 리스닝 포트
const port = 3000;

// Express 서비스 라우터
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

// Unexpected error handler
app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
      res.status(404).send("invalid json");
    } else {
      next();
    }
});

console.log(`Simple API Wrapper run on localhost:${port}`)

async function toastapi() {

    // express 서비스 시작
    app.listen(port);

}

module.exports = {
    toastapi
}