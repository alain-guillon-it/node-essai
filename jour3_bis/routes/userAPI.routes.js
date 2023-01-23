const router = require("express").Router();
const UserModel = require("../models/users");

router.route("/").get((req, res) => {
  res.redirect("/api/users");
});

router.route("/users").get((req, res) => {
  UserModel.find()
    .then((data) => res.status(200).json(data))
    .catch((err) =>
      res.status(200).json({
        errorCode: 400,
        errorMessage: "Bad Request",
        err,
      })
    );
});

router
  .route("/user/:id")
  .get((req, res) => {
    UserModel.findOne({ _id: req.params.id })
      .then((document) => res.status(200).json(document))
      .catch((err) =>
        res.status(200).json({
          errorCode: 400,
          errorMessage: "Bad Request",
          err,
        })
      );
  })
  .put((req, res) => {
    UserModel.updateOne({ _id: req.params.id }, req.body)
      .then((data) => res.status(200).json(data))
      .catch((err) =>
        res.status(200).json({
          errorCode: 400,
          errorMessage: "Bad Request",
          err,
        })
      );
  })
  .delete((req, res) => {
    UserModel.deleteOne({ _id: req.params.id })
      .then((data) => res.status(200).json(data))
      .catch((err) =>
        res.status(200).json({
          errorCode: 400,
          errorMessage: "Bad Request",
          err,
        })
      );
  });

router.route("/user").post((req, res) => {
  let newUser = new UserModel(req.body);
  newUser
    .save()
    .then((document) => res.status(201).json(document))
    .catch((err) =>
      res.status(200).json({
        errorCode: 400,
        errorMessage: "Bad Request",
        err,
      })
    );
  console.log(newUser);
});

module.exports = router;
