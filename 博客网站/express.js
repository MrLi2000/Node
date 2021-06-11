const express = require('express');
const session = require('express-session');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');//cookie解析模块
const methodOverride = require('method-override');
const csurf = require('csurf');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');//文件上传中间件
const upload = multer({ dest: 'public/uploads/' });//指定上传目的路径
const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const helpers = require('view-helpers');
const ultimatePagination = require('ultimate-pagination');
const pkg = require('./package.json');
const db = 'mongodb://localhost/blog';//数据库路径
let log = 'dev';
module.exports = function(app, passport) {
  app.use(helmet());
  // 压缩中间件（应置于express.static之前）
  app.use(
    compression({
      threshold: 512
    })
  );
  app.use(
    cors({
      origin: 'http://localhost:3000',//只有该网站能够访问
      optionsSuccessStatus: 200, // 提供用于成功的选项请求的状态码      
      credentials: true  //配置是否传递Access-Control-Allow-Credentials的CORS头 
    })
  );
  app.use(express.static('./public'));// 静态文件中间件
  app.use(morgan(log));  //记录日志
  // 设置视图路径、模板引擎
  app.set('views', './views');
  app.set('view engine', 'ejs');
  // 将package.json暴露给视图
  app.use(function(req, res, next) {
    res.locals.pkg = pkg;    
    next();
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(upload.single('image'));//接收单个文件上传，参数为表单中的文件字段名称
  //增加请求类型
  app.use(
    methodOverride(function(req) {    
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // 在POST请求体寻找 _method ，然后删除它
        var method = req.body._method;
        console.log(method);
        delete req.body._method;
        return method;
      }
    })
  );
  //Cookie解析器应在session之前
  app.use(cookieParser());
  //设置会话(session)
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: pkg.name,
      store: new mongoStore({
        url: db,
        collection: 'sessions'
      })
    })
  );
  // 使用passport的session 
  app.use(passport.initialize());
  app.use(passport.session());
  // 闪存（flash）消息（应当在session之后声明）
  app.use(flash());
  app.use(helpers(pkg.name));  
  app.use(csurf());//应用csurf中间件
  app.use(function(req, res, next) {
    res.locals.csrf_token = req.csrfToken();//在请求地址中添加令牌并验证来防止CSRF攻击
    res.locals.paginate = ultimatePagination.getPaginationModel;//获取分页对象
    next();
  });
};
