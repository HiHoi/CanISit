var var_data = new Object();
var_data.timestamp = 0;
var_data.time = '';
var_data.data = [];
var_data.image = '';
var_data.xmax = 7000;
var_data.ymax = 5000;
var_data.data = [{"x":0,"y":0,"type":"chair"},{"x":700,"y":500,"type":"table"},{"x":102,"y":30,"type":"sitting"},{"x":502,"y":430,"type":"chair"},{"x":351,"y":120,"type":"table"}, {"x":650,"y":450,"type":"table"},{"x":0,"y":0,"type":"table"},{"x":350,"y":350,"type":"table"}]

function normalize_data(var_data){
    for (let i = 0; i < var_data.data.length; i++) {
        var_data.data[i].x = 700 * var_data.data[i].x / var_data.xmax;
        var_data.data[i].y = 500 * var_data.data[i].y / var_data.ymax;
    }
}
for (let i = 0; i < var_data.data.length; i++) {
    console.log(var_data.data[i].x);
}

normalize_data(var_data);


for (let i = 0; i < var_data.data.length; i++) {
    console.log(var_data.data[i].x);
}