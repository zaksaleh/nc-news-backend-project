const db = require("../connection");

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users`).then((result) => {
    return result.rows;
  });
};
