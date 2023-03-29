const db = require("../connection.js");

exports.fetchCommentsByArticleID = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      }
    });
};

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments
  (body, article_id, author, votes, created_at)
  VALUES
  ($1, $2, $3, 0, NOW())
  RETURNING *;`,
      [body, article_id, username]
    )
    .then((result) => {
      return result.rows;
    });
};
