const { fetchAllUsers, fetchUsername } = require("../models/users.models");

exports.getAllUsers = (req, res) => {
  fetchAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUsername(username)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
