const { type } = require("./redisCon");

console.log(new Date());
let now = new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'})
let usa = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'});
let end = new Date(2021,0,05,15,15,00).toLocaleString('zh-TW', {timeZone: 'Asia/Taipei',hour12:false})
console.log(now,end,usa);
console.log(end - now)
let tw =new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'});
console.log(tw);
let datetime = new Date('2021/01/02 13:02:09');
let ori = new Date();
let hour = ori.getHours();
let min = ori.getMinutes();
let sec = ori.getSeconds();
console.log(hour+":"+min+":"+sec+"ori:"+ori);
let date = new Date(2021,0,2);
console.log("date:"+date);
console.log("time"+datetime);
let datetimes = new Date('2/01/2020 13:02:09');
console.log("time"+datetimes);
datetime = datetime.getTime();
console.log(typeof datetime);
