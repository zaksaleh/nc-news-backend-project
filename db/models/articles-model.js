const db = require("../connection");
const { getArticles } = require("../controllers/articles-controller");

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

exports.fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  if (
    ![
      "created_at",
      "votes",
      "article_id",
      "comment_count",
      "title",
      "topic",
      "author",
      "article_img_url",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 404, msg: "Invalid sort query" });
  }

  if (!["desc", "asc"].includes(order)) {
    return Promise.reject({ status: 404, msg: "Invalid order query" });
  }

  let articlesQueryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id)::INT AS comment_count 
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id`;
  const queryParams = [];

  if (topic) {
    articlesQueryString += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  articlesQueryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(articlesQueryString, queryParams).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Query does not exist" });
    } else {
      return result.rows;
    }
  });
};

exports.updateArticleWithID = (article_id, inc_votes) => {
  return db
    .query(`SELECT article_id, votes FROM articles WHERE article_id = $1`, [
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No article assigned to ID",
        });
      } else {
        const voteCount = rows[0].votes + inc_votes;
        return db.query(
          `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING*;`,
          [voteCount, article_id]
        );
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
