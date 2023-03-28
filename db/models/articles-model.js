const db = require("../connection");
const {
  getArticlesWithCommentCount,
} = require("../controllers/articles-controller");

exports.fetchArticleId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      } else {
        return result.rows;
      }
    });
};

exports.fetchArticlesWithCommentCount = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
      FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC`
    )
    .then((result) => {
      return result.rows;
    });
};
