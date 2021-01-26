const express = require("express")

const LIMIT = 20;
const DELAY = 1000;

const app = express()

const connections = []

app.get("/date", (req, res, next) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.setHeader("Transfer-Encoding", "chunked")

  connections.push(res)
})

let tick = 0;

setTimeout(function run() {
  console.log(tick)
  if(++tick > LIMIT){
    connections.map(res => {
      res.write("END\n")
      res.end()
    
    })
    connections = [];
    tick = 0
  }
  connections.map((res, i) => {
    res.write(`Hello ${i}! Tick: ${tick} \n`)
  })
  setTimeout(run, DELAY)
}, DELAY)

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})
//======================================
// var events = require('events');
// var dispatcher = new events.EventEmitter();
// var num = 0;

// setInterval(function() {
//     // 將 num 加一，更新資料
//     num++;

//     // 通知所有客戶端資料有更新
//     dispatcher.emit('update');
//     console.log(num+"ddd");
// }, 1000);



// app.get('/poll', function(req, res) {
//     // 送資料到客戶端
//     res.send(num);

//     // 當有資料更新
//     dispatcher.once('update', function() {
//         res.write(num);
//         console.log(num);
//         // 中斷連線
//         res.end();
//     });

// });