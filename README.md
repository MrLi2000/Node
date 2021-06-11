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
