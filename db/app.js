const express = require("express");
const { getAllTopics } = require("./controllers/topics-controller");

const app = express();

app.get("/api/topics", getAllTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid file path!" });
});

module.exports = { app };
