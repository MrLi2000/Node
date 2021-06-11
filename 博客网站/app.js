const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
require("./models/article.js");  //导入文章模型
require("./models/user.js"); //导入用户模型
const app = express();
require('./passport')(passport);//导入认证配置
require('./express')(app, passport);//导入中间件配置
require('./routes')(app, passport);//导入路由控制
const db = 'mongodb://localhost/blog';//数据库路径
const port = 3000;//HTTP端口
connect();//连接数据库
function listen() {
  app.listen(port);
  console.log('网站运行端口： ' + port);
}
function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);//运行Express
  return mongoose.connect(db, { keepAlive: 1, useNewUrlParser: true });
}
module.exports = app;
