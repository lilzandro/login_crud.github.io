const express = require("express");
const router = express.Router();

const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");

router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("auth/registrarse");
});

router.post(
  "/signup",
  isNotLoggedIn,
  passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/signin", isNotLoggedIn, (req, res) => {
  res.render("auth/iniciar");
});

router.post("/signin", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local.signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req, res, next);
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  // Renderizar la vista de confirmación de cierre de sesión
  res.render("partials/confirm-logout", {
    // message: req.flash("message"), // Mensaje flash
  });
});

router.get("/logout/confirm", isLoggedIn, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("succes", "¡Has cerrado sesión exitosamente!"); // Mensaje flash de éxito
    res.redirect("/signin");
  });
});

module.exports = router;
