/**本地验证 */
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const User = mongoose.model('User');
module.exports = function(passport) {
  //序列化，用户提交后会把id作为唯一标识储存在session中，同时存储在用户的cookie中
  passport.serializeUser(function(user, cb) {
    return cb(null, user.id);
  });
  //验证用户是否登录时需要用到此方法，session根据id取回用户的登录信息并存储在req.user中
  passport.deserializeUser(function(id, cb) {    
      User.load({ criteria: { _id: id } }, cb);    
  }); 
  //创建本地策略,通过MongoDB数据库来验证
  passport.use(new LocalStrategy(
    //需要验证的字段名称
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    //回调函数
    function(email, password, done) {
      //查询用户的条件，以Email作为入口
      const options = {
        criteria: { email: email },
        select: 'name username email hashed_password salt'
      };
      //读取用户信息进行比对
      User.load(options, function(err, user) {
        //验证未通过
        if (err) return done(err);
        if (!user) {
          return done(null, false, { message: '未知用户' });
        }
        //调用用户模型中的自定义实例方法authenticate
        if (!user.authenticate(password)) {
          return done(null, false, { message: '无效密码' });
        }
        //验证通过，返回用户信息
        return done(null, user);
      });
    })
  );
};
