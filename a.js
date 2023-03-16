// let today = new Date();

// timestemp = today.getTime();
// // setTimeout(() => {
// //     today = new Date()
// //     timestemp1 = today.getTime();
// //     console.log(today);
// //     console.log('before' + timestemp);
// //     console.log('after ' + timestemp1);
// //     }
// //     , 3000);

// time = today.toLocaleDateString('ko-KR') + " " + today.toLocaleTimeString('ko-KR');
// console.log(time);

// today2 = new Date(timestemp);
// time1 = today2.toLocaleDateString('ko-KR') + " " + today2.toLocaleTimeString('ko-KR');
// console.log(time1);
// console.log(today);
// console.log(today2);

function check_vaild_ip(subnetIp, req){
    const requestIp = require('request-ip');
    let guestIp = requestIp.getClientIp(req);
    return(guestIp.startsWith(subnetIp));
}