const { fetchAllUsers } = require("../models/users.models");

exports.getAllUsers = (req, res) => {
  fetchAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};
