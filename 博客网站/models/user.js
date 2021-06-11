/* 模块依赖 */
const mongoose = require('mongoose');
const crypto = require('crypto');//引入crypto模块

const Schema = mongoose.Schema;
/* 定义User模式  */
const UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' }
});
/* 检测值是否存在 */
const validatePresenceOf = function(value) {
   return value && value.length;   
} 

/* 设置虚拟属性 */
UserSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

/* 定义验证器 */

UserSchema.path('name').validate(function(name) {
   return name.length;
}, '名字不能为空');
UserSchema.path('email').validate(function(email) {
    return email.length;
}, 'Email不能为空');
UserSchema.path('email').validate(function(email) {
  return new Promise(resolve => {
    const User = mongoose.model('User');
    // 只有新的用户或Email被修改时才进行检查
    if (this.isNew || this.isModified('email')) {
      User.find({ email }).exec((err, users) => resolve(!err && !users.length));
    } else resolve(true);
  });
}, 'Email `{VALUE}` 已经存在');
UserSchema.path('username').validate(function(username) {
  return username.length;
}, '用户名不能为空');
UserSchema.path('hashed_password').validate(function(hashed_password) {
  return hashed_password.length && this._password.length;
}, '密码不能为空');

/* 保存之前的钩子 */
UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();
  if (!validatePresenceOf(this.password)) {
    next(new Error('无效密码'));
  } else {
    next();
  }
});
/* 自定义实例方法 */
UserSchema.methods = {
  /*验证-检查密码是否相同，参数plainText表示明文 */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  /* 产生“盐值”  */
  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
  /* 对密码进行加密 */
  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  }
};
/* 自定义静态方法 */
UserSchema.statics = {
  /* 加载用户信息   */
  load: function(options, cb) {
    options.select = options.select || 'name username';
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  }
};
//基于模式定义生成一个模型类,对应于MongoDB集合
module.exports =mongoose.model('User', UserSchema);

