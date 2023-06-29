const db = require("../connection");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

exports.addNewTopic = (slug, description, reqLength) => {
  if (
    slug === undefined ||
    slug.length === 0 ||
    description === undefined ||
    description.length === 0 ||
    reqLength > 2 ||
    typeof description !== "string" ||
    typeof slug !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "Invalid information inputted" });
  }

  return db
    .query(
      `INSERT INTO topics
  (slug, description)
  VALUES
  ($1, $2)
  RETURNING *;`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
