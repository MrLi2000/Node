/**加载评论  */
exports.load = function(req, res, next, id) {
  req.comment = req.article.comments.find(comment => comment.id === id);
  if (!req.comment) return next(new Error('未找到评论！'));
  next();
};
/**添加评论 */
exports.create = async function(req, res) {
  const article = req.article;
  await article.addComment(req.user, req.body);
  res.redirect(`/articles/${article._id}`);
};
/**删除评论 */
exports.destroy = async function(req, res) {
  await  req.article.removeComment(req.params.commentId);
  req.flash('info', 'Removed comment');
  res.redirect(`/articles/${req.article.id}`);
};
