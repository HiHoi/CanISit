const express = require('express');
const app = express();
const res = require('express/lib/response');
const request = require('request');

function check_vaild_ip(subnetIp, req) {
    return(req.ip.startsWith(subnetIp));
}

app.set('port', process.env.PORT || 4000);

app.get('/', (req, res) => {
    if (check_vaild_ip('127.0.', req))
        res.send('Hello, Express!');
    else
        res.status(400).send('{"data": null, "timestamp":0}');
    console.log(req.hostname);
    console.log(req.protocol);
    console.log(req.path);
    console.log(req.ip);
});

app.listen(app.get('port'), '0.0.0.0' , () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
