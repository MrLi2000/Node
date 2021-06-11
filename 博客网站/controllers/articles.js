const mongoose = require('mongoose');
const only = require('only');
const Article = mongoose.model('Article');
const assign = Object.assign;
/**加载文章 */
exports.load = async function(req, res, next, id) {
  try {
    req.article = await Article.load(id);
    if (!req.article) return next(new Error('文章未找到！'));
  } catch (err) {
    return next(err);
  }
  next();
}
/**文章列表 */
exports.index = async function(req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const _id = req.query.item;
  const limit = 15;
  const options = {
    limit: limit,
    page: page
  };
  if (_id) options.criteria = { _id };
  const articles = await Article.list(options);
  const count = await Article.countDocuments();
  res.render('articles/index', {
    title: '文章',
    articles: articles,
    page: page + 1,
    pages: Math.ceil(count / limit)
  }); 
};
/** 进入发表新文章界面（表单） */
exports.new = function(req, res) {
  res.render('articles/new', {
    title: '发表新文章',
    article: new Article()
  });
};
/**添加新文章到数据库中 */
exports.create = async function(req, res) {
  const article = new Article(only(req.body, 'title body tags'));
  article.user = req.user;
  try {
    await article.uploadAndSave(req.file);
    req.flash('success', '发表文章成功！');
    res.redirect(`/articles/${article._id}`);
  } catch (err) {
    res.status(422).render('articles/new', {
      title: article.title || '发表新文章',
      errors: [err.toString()],
      article
    });
  }
};
/**进入修改文章界面(表单) */
exports.edit = function(req, res) {
  res.render('articles/edit', {
    title: '修改 ' + req.article.title,
    article: req.article
  });
};
/**更新文章到数据库中 */
exports.update = async function(req, res) {
  const article = req.article;
  assign(article, only(req.body, 'title body tags'));
  try {
    await article.uploadAndSave(req.file);   
    res.redirect(`/articles/${article._id}`);
  } catch (err) {
    res.status(422).render('articles/edit', {
      title: '修改 ' + article.title,
      errors: [err.toString()],
      article
    });
  }
};
/**显示文章 */
exports.show = function(req, res) {
  res.render('articles/show', {
    title: req.article.title,
    article: req.article
  });
};
/**删除文章 */
exports.destroy = async function(req, res) {
  await req.article.remove();
  req.flash('info', '删除文章成功！');
  res.redirect('/articles');
};
