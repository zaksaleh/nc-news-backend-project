const { fetchAllTopics, addNewTopic } = require("../models/topics-model");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  const reqLength = Object.keys(req.body).length;

  addNewTopic(slug, description, reqLength)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
