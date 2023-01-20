/**
 * =========================================================================
 * Dépendances
 * =========================================================================
 */
require("colors");
const path = require("path");
const morgan = require("morgan");
const express = require("express");
const favicon = require("serve-favicon");
const cookieSession = require("cookie-session");

/**
 * =========================================================================
 * Configuration du port
 * =========================================================================
 */
const PORT = process.env.PORT || 3000;

/**
 * =========================================================================
 * Invocation du framework express
 * =========================================================================
 */
const app = express();

/**
 * =========================================================================
 * Configuration de EJS
 * La ligne commentée, c'est simplement pour changer le dossier views
 * par défaut
 * =========================================================================
 */
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "toto"));

/**
 * =========================================================================
 * Utilisation des middlewares
 * =========================================================================
 */
app.use(morgan("dev"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cookieSession({
    secret: "JeSuisUnSuperCodeSecretQuiTueSaMere",
  })
);

/**
 * =========================================================================
 * Routes GET avec un tableau
 * =========================================================================
 */
app.get(["/", "/home", "/accueil"], (req, res) => {
  res.status(200).render("pages/home", {
    data: {
      titlePage: "HomePage",
      sessionLogin: req.params.login,
      sessionPassword: req.session.password,
    },
  });
});

/**
 * =========================================================================
 * Routes GET
 * =========================================================================
 */
app.get("/connexion", (req, res) => {
  const login = req.body.pseudo;
  const password = req.body.password;

  req.session.login = login;
  req.session.password = password;

  res.status(200).render("pages/connexion", {
    data: {
      titlePage: "Connexion",
      sessionLogin: req.session.login,
      sessionPassword: req.session.password,
    },
  });

  if (req.session.login) {
    document.URL.replace("/profile");
  }
});
app.get("/profile", (req, res) => {
  res.status(200).render("pages/profile", {
    data: {
      titlePage: "Profile",
      sessionLogin: req.session.login,
      sessionPassword: req.session.password,
    },
  });
});

/**
 * =========================================================================
 * Routes en cas d'erreur
 * =========================================================================
 */
app.use((req, res) => {
  res.status(404).render("pages/error", {
    data: {
      titlePage: "Error 404 - Page Not Found",
      sessionLogin: req.params.login,
      sessionPassword: req.session.password,
    },
  });
});

/**
 * =========================================================================
 * Démarrage du server
 * =========================================================================
 */
app.listen(PORT, () =>
  console.log(`Server Started at this address : http://localhost:${PORT}`)
);
