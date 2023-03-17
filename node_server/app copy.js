const express = require('express');
const res = require('express/lib/response');
const app = express();
const axios = require('axios');
const requestIp = require('request-ip');
const cors = require('cors');
const ip = require("ip");

app.use(cors({
    origin: '*',
}));

var save_data = new Object();
var new_data = new Object();

function checkVaildIp(subnetIp, req){ // npm i request-ip
    const requestIp = require('request-ip');
    let guestIp = requestIp.getClientIp(req);
    return(guestIp.startsWith(subnetIp));
}

function requestData() {
    axios({
        method: "get",
        url: "http://10.18.246.255:8000/",
        responseType: "json"
    })
    .then(function(response) {
        new_data = response.data;
        if (!save_data)
            save_data = new_data;
        else {
            
        }


        var json_obj = response.data;
        var_data.resolution = json_obj.resolution;
        var_data.data = json_obj.data;
        var_data.timestamp = new Date().getTime();
        var_data.image = json_obj.image;
        now = new Date(var_data.timestamp);
        var_data.time = now.toLocaleDateString('ko-KR') + " " + now.toLocaleTimeString('ko-KR');
        for (let i = 0; i < var_data.data.length; i++) {
            var_data.data[i].x = 650 * var_data.data[i].x / var_data.resolution.width;
            var_data.data[i].y = 450 * var_data.data[i].y / var_data.resolution.height;
        }
    })
    .catch(function (error) {
        console.log('\x1b[31m[Error_Server]\x1b[0m : ' + error.data);
        var_data.timestamp = 0;
    });
}

setInterval(() => {
    requestData();
}, 5000);

app.set('port', process.env.PORT || 4000);

var logger = function (req, res, next) {
    console.log(`\x1b[34m[Connect]\x1b[0m : ${req.ip}, ${req.method}, ${req.path}`);
    next();
};

app.use(logger);

app.get('/', (req, res) => {
    res.send('Hello, Node server');
});

app.get('/data', (req, res) => {
    now = new Date().getTime();
    if (var_data.timestamp == 0) {
        setTimeout(() => requestData(), 1000);
    }
    res.json(var_data);
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