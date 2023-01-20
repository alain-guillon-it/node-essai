require("colors");
const path = require("path");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const favicon = require("serve-favicon");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    secret: "JeSuisEncoreUnSecretSurpuissant",
  })
);

app.get(["/", "/home"], (req, res) => {
  res.status(200).render("pages/home", {
    data: {
      titlePage: "Le juste prix",
      loginAdmin: req.session.loginAdmin,
    },
  });
});

app.get("/admin", (req, res) => {
  if (!req.session.login && !req.session.password) {
    res.status(200).render("pages/admin", {
      data: {
        titlePage: "Connexion",
        loginAdmin: req.session.loginAdmin,
      },
    });
  } else {
    res.redirect("/admin/config");
  }
});

app.get("/admin/config", (req, res) => {
  if (
    req.session.loginAdmin != "Alain69" ||
    req.session.passwordAdmin != "toto"
  ) {
    res.status(403).render("pages/admin", {
      data: {
        titlePage: "Connexion",
        errorCode: 403,
        messageError: "Arf, il faut avoir un accès pour configurer le jeu",
        loginAdmin: req.session.loginAdmin,
      },
    });
  } else {
    res.status(200).render("pages/form", {
      data: {
        titlePage: "Configuration",
        loginAdmin: req.session.loginAdmin,
      },
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.playerOne = null;
  req.session.objectName = null;
  req.session.objectValue = null;
  req.session.tentative = null;
  req.session = null;
  res.redirect("/");
});

app.post("/admin", (req, res) => {
  const loginAdmin = req.body.pseudo;
  const passwordAdmin = req.body.password;

  req.session.loginAdmin = loginAdmin;
  req.session.passwordAdmin = passwordAdmin;

  if (
    req.session.loginAdmin != "Alain69" &&
    req.session.passwordAdmin != "toto"
  ) {
    res.render("pages/admin", {
      data: {
        errorCode: 403,
        messageError: "Désolé vous n'avez pas d'accès pour configurer le jeu",
        loginAdmin: req.session.loginAdmin,
      },
    });
  } else {
    res.redirect("/admin/config");
  }
});

app.post("/admin/config", (req, res) => {
  const playerOne = req.body.playerOne;
  const objectName = req.body.objectName;
  const objectValue = parseInt(req.body.objectValue);
  let tentative = parseInt(req.body.tentative);

  req.session.playerOne = playerOne;
  req.session.objectName = objectName;
  req.session.objectValue = objectValue;
  req.session.tentative = tentative;

  if (
    req.session.playerOne != null &&
    req.session.objectName != null &&
    req.session.objectValue != null &&
    req.session.tentative != null
  ) {
    res.render("pages/play", {
      data: {
        titlePage: "Joué au juste prix",
        playerOne: req.session.playerOne,
        objectName: req.session.objectName,
        objectValue: req.session.objectValue,
        tentative: req.session.tentative,
        loginAdmin: req.session.loginAdmin,
      },
    });
  } else {
    res.render("pages/admin", {
      data: {
        titlePage: "Configuration",
      },
    });
  }
});

app.get("/game", (req, res) => {
  req.session.counterTentative = 0;
  if (
    req.session.playerOne != "" ||
    req.session.tentative != "" ||
    req.session.objectValue != "" ||
    req.session.objectName != ""
  ) {
    res.redirect("/admin/config");
  } else {
    res.status(200).render("pages/play", {
      data: {
        loginAdmin: req.session.loginAdmin,
        titlePage: "Joué au juste prix",
        playerOne: req.session.playerOne,
        objectName: req.session.objectName,
        objectValue: parseInt(req.session.objectValue),
        tentative: parseInt(req.session.tentative),
      },
    });
  }
});

app.post("/game/check", (req, res) => {
  const newValue = req.body.newTry;
  let counterTentative = 0;
  let sessionCounter = counterTentative + 1;
  let tentative = req.session.tentative--;

  console.log({
    newValue,
    "a trouver": req.session.objectValue,
    counterTentative,
    tentative: req.session.tentative - 1,
    sessionCounter,
    tentative,
  });

  if (newValue < req.session.objectValue) {
    counterTentative++;
    req.session.counterTentative += counterTentative;

    res.status(200).render("pages/play", {
      data: {
        check: "less",
        counterTentative: parseInt(req.session.tentative) - 1,
        titlePage: "Joué au juste prix",
        playerOne: req.session.playerOne,
        objectName: req.session.objectName,
        objectValue: parseInt(req.session.objectValue),
        tentative: parseInt(req.session.tentative),
        loginAdmin: req.session.loginAdmin,
      },
    });
  } else if (newValue > req.session.objectValue) {
    counterTentative++;
    req.session.counterTentative += counterTentative;

    res.status(200).render("pages/play", {
      data: {
        check: "more",
        counterTentative: req.session.tentative - 1,
        titlePage: "Joué au juste prix",
        playerOne: req.session.playerOne,
        objectName: req.session.objectName,
        objectValue: parseInt(req.session.objectValue),
        tentative: parseInt(req.session.tentative),
        loginAdmin: req.session.loginAdmin,
      },
    });
  } else {
    res.status(200).render("pages/play", {
      data: {
        check: "ok",
        counterTentative: parseInt(req.session.counterTentative),
        titlePage: "Joué au juste prix",
        playerOne: req.session.playerOne,
        objectName: req.session.objectName,
        objectValue: parseInt(req.session.objectValue),
        tentative: parseInt(req.session.tentative - 1),
        loginAdmin: req.session.loginAdmin,
      },
    });
  }
});

app.get("/game/restart", (req, res) => {
  req.session.playerOne = null;
  req.session.objectName = null;
  req.session.objectValue = null;
  req.session.tentative = null;
  req.session.counterTentative = 0;

  if (!req.session.loginAdmin) {
    res.status(404).redirect("/admin");
  } else {
    res.status(200).redirect("/admin/config");
  }
});

app.use((req, res) => {
  res.status(404).render("pages/error", {
    data: {
      titlePage: "Error",
      codeError: 404,
      messageError: "Page Not Found",
      loginAdmin: req.session.loginAdmin,
    },
  });
});

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
