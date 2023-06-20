const express = require("express");
const { getAllTopics } = require("./controllers/topics-controller");
const {
  getArticleId,
  patchArticleWithID,
  getArticles,
} = require("./controllers/articles-controller");
const {
  handlePSQL400s,
  handleCustomErrors,
  handle500,
} = require("./controllers/errors.controller");
const {
  getCommentsByArticleID,
  postComment,
  deleteComment,
  patchCommentById,
} = require("./controllers/comments-controller.js");
const { getAllUsers, getUsername } = require("./controllers/users.controller");

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.get("/api/users", getAllUsers);
app.get("/api/users/:username", getUsername);

app.patch("/api/articles/:article_id", patchArticleWithID);
app.patch("/api/comments/:comment_id", patchCommentById);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid file path!" });
});

module.exports = app;
