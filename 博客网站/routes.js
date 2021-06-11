const users = require('./controllers/users');
const articles = require('./controllers/articles');
const comments = require('./controllers/comments');
const tags = require('./controllers/tags');
const auth = require('./middlewares/authorization');//导入自定义中间件
/**路由中间件  */
const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];
/**对外导出路由 */
module.exports = function(app, passport) {
  // 用户路由
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post(
    '/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: '无效的Email或密码！'
    }),
    users.session
  );
  app.get('/users/:userId', users.show);  
  app.param('userId', users.load);
  // 文章路由
  app.param('id', articles.load);
  app.get('/articles', articles.index);
  app.get('/articles/new', auth.requiresLogin, articles.new);
  app.post('/articles', auth.requiresLogin, articles.create);
  app.get('/articles/:id', articles.show);
  app.get('/articles/:id/edit', articleAuth, articles.edit);
  app.put('/articles/:id', articleAuth, articles.update);
  app.delete('/articles/:id', articleAuth, articles.destroy);
  // 主页路由
  app.get('/', articles.index);
  // 评论路由
  app.param('commentId', comments.load);
  app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.delete(
    '/articles/:id/comments/:commentId',
    commentAuth,
    comments.destroy
  );
  // 标签路由
  app.get('/tags/:tag', tags.index);
  /**错误处理   */
  app.use(function(err, req, res, next) {
    // 404错误
    if (
      err.message &&
      (~err.message.indexOf('not found') ||
        ~err.message.indexOf('Cast to ObjectId failed'))
    ) {
      return next();
    }
    console.error(err.stack);
    if (err.stack.includes('ValidationError')) {
      res.status(422).render('errors/422', { error: err.stack });
      return;
    }
   // 错误页面
    res.status(500).render('errors/500', { error: err.stack });
  });
  // 如果明白任何中间件响应将被视为 404错误
  app.use(function(req, res) {
    const payload = {
      url: req.originalUrl,
      error: '未发现'
    };
    if (req.accepts('json')) return res.status(404).json(payload);
    res.status(404).render('errors/404', payload);
  });
};
