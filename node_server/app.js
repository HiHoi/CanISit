const express = require('express');
const res = require('express/lib/response');
const app = express();
const request = require('request');
const requestIp = require('request-ip');
const cors = require('cors');
const ip = require("ip");

app.use(cors({
    origin: '*',
}));

var var_data = new Object();
var_data.timestamp = 0;
var_data.time = '';
var_data.data = [];
var_data.image = '';

function checkVaildIp(subnetIp, req){ // npm i request-ip
    const requestIp = require('request-ip');
    let guestIp = requestIp.getClientIp(req);
    return(guestIp.startsWith(subnetIp));
}

app.set('port', process.env.PORT || 4000);

var logger = function (req, res, next) {
    console.log(`\x1b[34m[Connect]\x1b[0m : ${req.ip}, ${req.method}, ${req.path}`);
    next();
};

app.use(logger);

app.get('/', (req, res) => {
    res.send('Hello, Express');
});

app.get('/data', (req, res) => {
    var_data.data = [{"x":0.0,"y":0.5,"type":"chair"},{"x":10.5,"y":5.8,"type":"table"},{"x":102,"y":30,"type":"sitting"},{"x":502,"y":430,"type":"chair"},{"x":351,"y":120,"type":"table"}, {"x":650,"y":450,"type":"table"},{"x":0,"y":0,"type":"table"},{"x":350,"y":350,"type":"table"}]
    var_data.timestamp = new Date().getTime();
    now = new Date(var_data.timestamp);
    var_data.time = now.toLocaleDateString('ko-KR') + " " + now.toLocaleTimeString('ko-KR');
    // for (let i = 0; i < var_data.data.length; i++) {
    //     var_data.data[i].x = 700 * var_data.data[i].x / var_data.xmax;
    //     var_data.data[i].y = 500 * var_data.data[i].y / var_data.ymax;
    // }
    res.json(var_data);
});

app.get('/test', (req, res) => {
    let ip = requestIp.getClientIp(req);
    // 데이터 확인
    now = new Date().getTime();
    if (now - var_data.timestamp > 5000 || var_data.timestamp == 0) {
        // 없거나  요청
        const request = require('request');
        const options = {
            uri: "https://api.npoint.io/f4416f3f06c4a0b23a9c"
        };
        function callback(error, response, body) {
            if (error || response.statusCode != 200) {
                res.status(500).send(error.message);
            }
            else {
                // console.log('Get new data');
                const json = body;
                const json_obj = JSON.parse(json);
                var_data.data = json_obj.data;
                var_data.timestamp = json_obj.timestamp;
                var_data.image = json_obj.image;
                now = new Date(var_data.timestamp);
                var_data.time = now.toLocaleDateString('ko-KR') + " " + now.toLocaleTimeString('ko-KR');
                res.json(var_data);
            }
        }
        request(options, callback);
    }
    else {
        res.json(var_data);
    }
});

app.get('/image', (req, res) => {
    var fs = require('fs');
    fs.readFile('./catcat.png', function (err, data) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(data);
        // res.send(data);
    });
    // 데이터 확인
    // now = new Date().getTime();
    // if (now - var_data.timestamp > 5 || var_data.timestamp == 0) {
    //     // 없으면 요청
    //     const request = require('request');
    //     const options = {
    //         uri: "https://api.npoint.io/f4416f3f06c4a0b23a9c"
    //     };
    //     function callback(error, response, body) {
    //         if (error || response.statusCode != 200) {
    //             res.status(500).send(error.message);
    //         }
    //         else {
    //             var_data = body;
    //             console.log('Get new image');
    //             res.send(var_data);
    //         }
    //     }
    //     request(options, callback);
    // }
    // else {
    //     res.send(var_data);
    // }
});

app.use((req, res) => {
	res.status(400).send('{"data": null, "timestamp":0}');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), '0.0.0.0' , () => {
    console.log(`\x1b[33m[LISTEN]\x1b[0m ${ip.address()}:${app.get('port')}`);
});

// npm start