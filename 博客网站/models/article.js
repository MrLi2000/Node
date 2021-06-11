const fs = require('fs');
const mongoose = require('mongoose');
//获取标签函数，join()方法用于把数组中的所有元素放入一个字符串。
const getTags = function(tags){ 
    return tags.join(',');
}  
//设置标签函数，split()方法用于把一个字符串分割成字符串数组  
const setTags =  function(tags){ 
  return tags.split(',').slice(0, 10);
} 
/**  定义Article模式  */
const Schema = mongoose.Schema;
const ArticleSchema = new  Schema({
  title: { type: String, default: '', trim: true, maxlength: 400 },
  body: { type: String, default: '', trim: true, maxlength: 1000 },
  user: { type: Schema.ObjectId, ref: 'User' },
  comments: [
    {
      body: { type: String, default: '', maxlength: 1000 },
      user: { type: Schema.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  tags: { type: [], get: getTags, set: setTags },
  imageUri: { type: String },
  createdAt: { type: Date, default: Date.now }
});
/** 定义验证器 */
ArticleSchema.path('title').required(true, '文章标题不能为空');
ArticleSchema.path('body').required(true, '文章正文不能为空');
/** 删除之前的钩子 */
ArticleSchema.pre('remove', function(next) {  
  if (this.imageUri){
    const image = './public'+this.imageUri;
    fs.unlinkSync(image);  //删除关联的图片文件
  }
  
  next();
});
/** 自定义实例方法 */
ArticleSchema.methods = {
  /** 保存文章和上传图像，参数image为对象 */
  uploadAndSave: function(image) {
    const err = this.validateSync();
    if (err && err.toString()) throw new Error(err.toString());
    if (image)  this.imageUri='/uploads/'+image.filename;
    return this.save();//    这里的this指的是具体文档上的this
  },
  /** 添加评论，参数user和comment  */
  addComment: function(user, comment) {
    this.comments.push({
      body: comment.body,
      user: user._id
    });
    return this.save();
  },
  /** 删除评论，参数commentId   */
  removeComment: function(commentId) {
    const index = this.comments.map(comment => comment.id).indexOf(commentId);
    if (~index) this.comments.splice(index, 1);
    else throw new Error('Comment not found');
    return this.save();
  }
};
/**  自定义静态方法 */
ArticleSchema.statics = {
  /** 通过id获取文章  */
  load: function(_id) {
    return this.findOne({ _id })    //这里的this 指的就是Model
      .populate('user', 'name email username')
      .populate('comments.user')
      .exec();
  },
  /** 根据条件列出文章  */
  list: function(options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .populate('user', 'name username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  } 
};
//基于模式定义生成一个模型类,对应于MongoDB集合
module.exports = mongoose.model('Article', ArticleSchema);
