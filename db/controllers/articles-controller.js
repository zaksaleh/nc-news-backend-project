const {
  fetchArticleId,
  fetchArticles,
  updateArticleWithID,
  fetchArticlesQueries,
  checkTopicExists,
  addNewArticle,
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

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;

  const fetchArticlesPromise = fetchArticles(topic, sort_by, order);
  const checkTopicPromise = checkTopicExists(topic);

  Promise.all([fetchArticlesPromise, checkTopicPromise])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
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

exports.postArticle = (req, res, next) => {
  const { title, topic, author, body, article_img_url } = req.body;

  addNewArticle(title, topic, author, body, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
