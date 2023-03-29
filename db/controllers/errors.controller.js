exports.handlePSQL400s = (err, req, res, next) => {
  //console.log(err);

  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Information not found" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Invalid request: missing information" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "SERVER ERROR" });
};
