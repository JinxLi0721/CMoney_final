const redis = require("redis");
const command = require("../config/RedisCommand");
const client = require('../config/redisCon');
const universal = require('../config/universal');


// var _uuid = function (length) {
//         var d = Date.now();
//         if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
//             d += performance.now(); //use high-precision timer if available
//         }
//         // var r = Math.random().toString(16).substr(3,length);

//         d = d.toString(16).substr(Math.random()*5,length);
//         return d;


//     }


// let j = 0
// async {

// let i =0;


// await function(test)


// function test(){

// }
// }







// console.log(_uuid(5));

// 端口、IP、密码
// var client = redis.createClient(6379, '127.0.0.1');

// client.on("error", function(error) {
//     console.error(error);
//   });


// client.set("key1",123,redis.print);
// client.get("key1",redis.print);


// client.on('connect', async () => {
//   console.log('Redis client connected');
//   try {
//     await command.setValue('foo', 'aaa')
//     await command.setValue('www', 'qq')
//   let r = await command.getValue('qq')
//   console.log(r);
//   } catch (error) {
//     console.log(error);
//   }
  


  //     .then(() => {
  //       console.log('Redis client connected');


// })


//     .catch ((err) =>{
//     console.log(error);
//     throw error;
//     });
//   await command.setValue('foo','aoo')
//   .then(()=>{
//     client.get("foo",redis.print);
//   })



// });  


// var obj = {
//   key1: "value1",
//   key2: "value2"
// };

// obj.key3 = "value3";
// console.log(obj);

// var getProperty = function (propertyName) {
//   return obj[propertyName];
// };
// var putObj =function (key,value){
//   return obj.key = value;
// }


// putObj("aaa","rr");
// obj.adf = "eee";
// console.log(obj);

//=============

// let setSize = 20;

// client.sadd("key", "member1");
// client.sadd("key", "member2");

// while (setSize > 0) {
//   client.sadd("key", "member" + setSize);
//   setSize -= 1;
// }

// // chain commands
// client
//   .multi()
//   .scard("key")
//   .smembers("key")
//   .keys("*")
//   .dbsize()
//   .exec(function(err, replies) {
//     console.log("MULTI got " + replies.length + " replies");
//     replies.forEach(function(reply, index) {
//       console.log("REPLY  @ index " + index + ": " + reply.toString());
//     });
//   });
//===============

// var obj = {
//   // length: 0,

//   addElem: function addElem(key,elem) {
//       // obj.length is automatically incremented
//       // every time an element is added.
//       [].push.call(this,key, elem);
//   },
//   // room :this.addElem(5)
// };

// // Let's add some empty objects just to illustrate.
// obj.addElem(1,2);
// obj.addElem(1,3);
// console.log(obj);

//====================

// let y=universal.genID(5,3);
// console.log(y);
//==========================================
// let registerDate = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate().toString();
// console.log(registerDate);

// let dateTrans = function(date){
//   date.toString(1,10);
// }
// console.log(dateTrans(registerDate));
//==========================
// client
//   .multi()
//   .scard("000")
//   .smembers("000")
//   .keys("*")
//   .dbsize()
//   .exec(function(err, replies) {
//     console.log("MULTI got " + replies.length + " replies");
//     replies.forEach(function(reply, index) {
//       console.log("REPLY  @ index " + index + ": " + reply.toString());
//     });
//   });
//=======================
// var str="hello world!";
// str=str.replace("l","");
// console.log(str);

//==========
let now = new Date(1610087639844);
console.log("now"+now);