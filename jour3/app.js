require("dotenv").config();
const connect = require("./db/connect");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5050;

const UserModel = require("./models/users");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/users", (req, res) => {
  UserModel.find({})
    .exec()
    .then((documents) => {
      console.log(documents);
      res.status(200).json(documents);
    })
    .catch((err) => console.log(err));
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findById(id).then((data) => {
    console.log(data);
    res.json(data);
  });
});

app.get("/add", (req, res) => {
  res.render("pages/addUser");
});

app.get("/update", (req, res) => {
  UserModel.find()
    .then((documents) => {
      res.render("pages/update", {
        data: documents,
      });
    })
    .catch((err) => console.log(err));
});
app.get("/update/:id", (req, res) => {
  UserModel.findById(req.params.id)
    .then((document) => {
      console.log(document);
      res.render("pages/updateUser", {
        data: document,
      });
    })
    .catch((err) => console.log(err));
});

app.post("/update/:id", (req, res) => {
  UserModel.findById(req.params.id)
    .then((data) => {
      console.log(data.id);

      UserModel.findByIdAndUpdate(
        {
          _id: data.id,
          // firstName: data.firstName,
          // lastName: data.lastName,
          // email: data.email,
          // password: data.password,
        },
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
        },
        { new: true }
      )
        .then(() => {
          // console.log(data);
          res.redirect("/users");
        })
        .catch((err) => console.log("Cette ID n'existe pas", { err }));
    })
    .catch((err) => console.log(err));
});

app.post("/add", (req, res) => {
  const newUser = new UserModel({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  });

  console.log(newUser);

  newUser
    .save()
    .then((data) => {
      console.log(data);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
