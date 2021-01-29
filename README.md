# CMoney_final
因為此專案有用到Redis資料庫+Mysql，所以要先安裝這兩個資料庫並做好連線。以下介紹在本地跑需做的步驟

## 1. 本地安裝Redis

### 1.1、安裝地址

- Redis 官網：**[redis.io/download](http://redis.io/download)** (用cmd做)
- Redis  github ：**[github.com/MSOpenTech/…](https://github.com/MSOpenTech/redis/tags)**

### 1.2、安装流程
< 用github做示範 >
- 下載[win-3.2.100版本]，[Redis-x64]
![](https://i.imgur.com/Ht2cQ2u.png)
- 安裝完成後，進入此資料夾內，打開redis-server.exe，開啟server
 ![](https://i.imgur.com/SHoM4qt.png)

- 打開此資料夾內 redis-cli.exe，出現連線，輸入ping，跑出pong，表示連接成功
![](https://i.imgur.com/8av7CzK.png)

## 2.安裝Mysql、workbench

2.1 跟著[MySQL建置](http://34.80.12.180/7th/share/-/wikis/MySQL/MySQL%E5%BB%BA%E7%BD%AE)做

2.2 因為是本地跑，所以將code裡與資料庫連線的註解打開

config/index.js

```host: "127.0.0.1", ```

2.3 將schema匯入，[MySQL Workbench & phpMyAdmin 匯出／匯入（備份）完整 MySQL 資料庫教學](https://mnya.tw/cc/word/1395.html)

## 3. Run Project

3.1 開啟Redis server
- 打開redis-server.exe，有跑出以下畫面即成功
 ![](https://i.imgur.com/SHoM4qt.png)


3.2 在IDE裡輸入```npm run start```即可，恭喜你成功～
