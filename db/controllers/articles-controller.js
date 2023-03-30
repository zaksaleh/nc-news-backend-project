const {
  fetchArticleId,
  fetchArticlesWithCommentCount,
  updateArticleWithID,
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

exports.patchArticleWithID = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleWithID(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
