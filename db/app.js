const express = require("express");
const { getAllTopics } = require("./controllers/topics-controller");
const { getArticleId } = require("./controllers/articles-controller");
const {
  handlePSQL400s,
  handleCustomErrors,
  handle500,
} = require("./controllers/errors.controller");
const {
  getCommentsByArticleID,
} = require("./controllers/comments-controller.js");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid file path!" });
});

module.exports = { app };
