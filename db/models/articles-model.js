const db = require("../connection");
const { getArticles } = require("../controllers/articles-controller");

exports.fetchArticleId = (article_id) => {
  let articlesQueryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id)::INT AS comment_count 
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1`;

  articlesQueryString += ` GROUP BY articles.article_id`;

  return db.query(articlesQueryString, [article_id]).then((result) => {
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
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["desc", "asc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
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
    return result.rows;
  });
};

exports.checkTopicExists = (topic) => {
  if (typeof topic === "string") {
    return db
      .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
      .then((result) => {
        if (result.rowCount === 0) {
          return Promise.reject({ status: 400, msg: "Topic does not exist" });
        }
      });
  }
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

exports.addNewArticle = (title, topic, author, body, article_img_url) => {
  if (
    title === undefined ||
    title.length === 0 ||
    topic === undefined ||
    topic.length === 0 ||
    body === undefined ||
    body.length === 0 ||
    author === undefined ||
    author.length === 0
  ) {
    return Promise.reject({ status: 400, msg: "Invalid information inputted" });
  }

  return db
    .query(
      `INSERT INTO articles
  (title, topic, author, body, article_img_url)
  VALUES
  ($1, $2, $3, $4, $5)
  RETURNING *;`,
      [title, topic, author, body, article_img_url]
    )
    .then(({ rows }) => {
      const articleId = rows[0].article_id;
      const article = exports.fetchArticleId(articleId);
      return article;
    })
    .then((article) => {
      return article[0];
    });
};
