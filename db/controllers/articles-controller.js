const {
  fetchArticleId,
  fetchArticlesWithCommentCount,
} = require("../models/articles-model.js");

exports.getArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesWithCommentCount = (req, res, next) => {
  fetchArticlesWithCommentCount().then((articles) => {
    res.status(200).send({ articles });
  });
};
