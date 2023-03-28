const db = require("../connection");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};
