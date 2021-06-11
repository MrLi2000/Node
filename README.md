# Node
## 技术栈
- 博客网站主要基于 node + express + mongoose 构成
- 前端渲染页面使用 bootstrap + EJS + Font-Awesome 技术搭建
- 其中还使用了其他第三方库、插件以及node内置模块...
  - crypto用于密码加密的node内置模块
  - bootstrap-Tagsinput用于管理标签的插件
  - Font-Awesome图标库
  - EJS模板引擎界面渲染
  - passport 用户登录认证中间件
  - .....
## 目录结构
> controllers
  ```markdown
   - articles.js   # 文章控制器
   - users.js      # 用户控制器
  ```
> middlewares
  ```markdown
   - authorization.js  # 路由登录中间件
  ```
> models
  ```markdown
   - article.js  # 存储文章信息模型
   - user.js     # 存储用户信息模型
  ```
> node_modules
  ```markdown
   存储第三方模块
  ```
> public
  ```markdown
   静态资源文件[前端]
  ```
> views
  ```markdown
   视图模板文件[前端]
  ```
> app.js
  ```markdown
   程序主入口文件
  ```
> express.js
  ```markdown
   express应用程序基本配置，重点挂载使用的组件
  ```
> passport.js
  ```markdown
   用户认证
  ```
> routes.js
  ```markdown
   路由控制
  ```
> package.json
  ```markdown
   项目配置文件
  ```
  
## 启动
 - 项目主入口文件是：app.js
 - 需要将package.json文件中启动脚本修改：
 ```js
   "scripts" : {
      "start": "node ./app.js"
   }
 ```
 - 启动服务
 ```shell
   npm start
 ```
 - 访问
 ```markdown
   1. 打开浏览器输入网址： http://127.0.0.1:3000
   2. 打开浏览器输入网址： http://localhost:3000
 ```
