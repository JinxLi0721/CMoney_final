const client = require('./redisCon');

const setValue = function (key, value) {
    return new Promise((res,rej) => {
        client.set(key, value,function(err,reply){
            if(reply){
                res(reply);
            }else {
                rej(err);
            }
        });
    });
}
const getValue = function (key) {
    return new Promise((res,rej) => {
        client.get(key,function(err,reply){
            if(reply){
                res(reply);
            }else {
                rej(err);
            }
        });
    });
}

const sadd = function (key, value) {
    return new Promise((res,rej) => {
        client.sadd(key, value,function(err,reply){
            if(reply){
                res(reply);
            }else {
                rej(err);
            }
        });
    });
}

const scard = function(key){
    return new Promise((res,rej) => {
        client.scard(key,function(err,reply){
            if(reply|| err == null){
                res(reply);
            }else {
                rej(err);
            }
        });
    });
}
const srem = function(key,value){
    return new Promise((res,rej)=>{
        client.srem(key,value,function(err,reply){
            if(reply){
                res(reply);
            }else{
                rej(err);
            }
        })
    })
}

const smembers = function(key){
    return new Promise((res,rej)=>{
        client.smembers(key,function(err,reply){
            if(reply){
                res(reply);
            }else{
                rej(err);
            }
        })
    })
}

const hset = function(key,field,value){
    return new Promise((res,rej)=>{
    
        client.hset(key,field,value,function(err,reply){
            if(reply){
                res(reply);
            }else{
                rej(err);
            }
        })
    })
}

const hget = function(key,field){
    return new Promise((res,rej)=>{
        client.hget(key,field,function(err,reply){
            if(reply){
                res(reply);
            }else{
                rej(err);
            }
        })
    })
}

const hdel = function(key,field){
    return new Promise((res,rej)=>{
        client.hdel(key,field,function(err,reply){
            if(reply){
                res(reply);
            }else{
                rej(err);
            }
        })
    })
}

const lpush = function(key,value){
    return new Promise((res,rej)=>{
        client.lpush(key,value,function(err,reply){
            if(reply){
                res(reply);
            }else{
                rej(err);
            }
        })
    })
}

const set = function(key,value){
    return new Promise((res,rej)=>{
        client.set(key,value,function(err,reply){
            if(reply){
                res(reply);
            }else{
                rej(err);
            }
        })
    })
}
const sort = function(key,pattern,pattern2){
    return new Promise((res,rej)=>{
        client.sort(key,"by",pattern,"get",pattern2,function(err,reply){
            if(reply){
                res(reply);
            }else{
                rej(err);
            }
        })
    })
}
const exists = function(key){
    return new Promise((res,rej)=>{
        client.exists(key,function(err,reply){
            if(reply|| err == null){
                res(reply);
            }else{
                rej(err);
            }
        })
    })
}




module.exports = {
    setValue,
    getValue,
    sadd,
    scard,
    srem,
    smembers,
    hset,
    hget,
    hdel,
    lpush,
    set,
    sort,
    exists
};