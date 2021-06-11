/** 要求登录路由中间件 */
exports.requiresLogin = function(req, res, next) {
  if (req.isAuthenticated()) return next();//已通过认证（调用password的req.isAuthenticated()）则跳到下一个中间件
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;//记录GET请求的URL
  res.redirect('/login');//所有未通过认证的访问都将重定向到登录页面
};
/** 用户访问授权路由中间件 */
exports.user = {
  hasAuthorization: function(req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', '您未被授权！');
      return res.redirect('/users/' + req.profile.id);
    }
    next();
  }
};
/** 文章访问授权路由中间件 */
 exports.article = {
  hasAuthorization: function(req, res, next) {
    if (req.article.user.id != req.user.id) {
      req.flash('info', '您未被授权！');
      return res.redirect('/articles/' + req.article.id);
    }
    next();
  }
};
/** 评论访问授权路由中间件*/
exports.comment = {
  hasAuthorization: function(req, res, next) {
    // 如果当前用户是评论所有者或文章所有者，授予删除的权限
    if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
      next();
    } else {
      req.flash('info', '您未被授权！');
      res.redirect('/articles/' + req.article.id);
    }
  }
};
