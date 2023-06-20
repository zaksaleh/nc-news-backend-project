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
  (body, article_id, author)
  VALUES
  ($1, $2, $3)
  RETURNING *;`,
      [body, article_id, username]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      }
    });
};

exports.updateCommentById = (comment_id, inc_votes) => {
  return db
    .query(`SELECT comment_id, votes FROM comments WHERE comment_id = $1`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comment assigned to ID",
        });
      } else {
        const voteCount = rows[0].votes + inc_votes;
        return db.query(
          `UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING*;`,
          [voteCount, comment_id]
        );
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
