const mongoose = require('mongoose');
const User = mongoose.model('User');
/**加载用户信息 */
exports.load = async function(req, res, next, _id) {
  const criteria = { _id };
  try {
    req.profile = await User.load({ criteria });
    if (!req.profile) return next(new Error('未找到用户！'));
  } catch (err) {
    return next(err);
  }
  next();
};
/**创建用户（注册） */
exports.create = async function(req, res) {
  const user = new User(req.body);
 
  try {
    await user.save();
    req.login(user, err => {   //调用passport的req.login()方法建立session
      if (err) req.flash('info', '抱歉！您的注册未通过！');
      res.redirect('/');
    });
  } catch (err) {
    const errors = Object.keys(err.errors).map(
      field => err.errors[field].message
    );
    res.render('users/signup', {
      title: '注册',
      errors,
      user
    });
  }
};
/**显示用户信息 */
exports.show = function(req, res) {
  const user = req.profile;
  res.render('users/show', {
    title: user.name,
    user: user
  });
};
exports.signin = function() {};
/**认证回调 */
exports.authCallback = login;
/**显示登录表单 */
exports.login = function(req, res) {
  res.render('users/login', {
    title: '登录'
  });
};
/**显示注册表单 */
exports.signup = function(req, res) {
  res.render('users/signup', {
    title: '注册',
    user: new User()
  });
};
/**退出 */
exports.logout = function(req, res) {
  req.logout();    //调用passport的req.logout()方法终止session
  res.redirect('/login');
};
/**处理Session */
exports.session = login;
/**登录 */
function login(req, res) {
  const redirectTo = req.session.returnTo ? req.session.returnTo : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
}
