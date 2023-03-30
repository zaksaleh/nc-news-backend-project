const {
  fetchCommentsByArticleID,
  checkArticleExists,
  insertComment,
  checkUsernameExists,
} = require("../models/comments-model");

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;

  const fetchCommentsPromise = fetchCommentsByArticleID(article_id);
  const checkArticlePromise = checkArticleExists(article_id);

  Promise.all([fetchCommentsPromise, checkArticlePromise])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
