const express = require("express");
const router = express.Router();

const pool = require("../databases");
const { isLoggedIn } = require("../lib/auth");

router.get("/add", isLoggedIn, (req, res) => {
  res.render("links/add");
});

router.post("/add", isLoggedIn, async (req, res) => {
  const { nameContacto, tlf, correo, description } = req.body;
  const newLink = {
    nameContacto,
    tlf,
    correo,
    description,
    user_id: req.user.id,
  };
  await pool.query("INSERT INTO contact set ?", [newLink]);
  req.flash("succes", "Link guardado correctamente");
  res.redirect("/links");
});

router.get("/", isLoggedIn, async (req, res) => {
  const links = await pool.query("SELECT * FROM contact where user_id = ?", [
    req.user.id,
  ]);
  res.render("links/lista", { links });
});

router.get("/delete/msj/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  res.render("partials/confirm-delete", { id: id });
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query("delete from contact where id = ?", [id]);
  req.flash("succes", "Link eliminado correctamente");
  res.redirect("/links");
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const links = await pool.query("select * from contact where id = ?", [id]);
  console.log(links[0]);
  res.render("links/editar", { link: links[0] });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { nameContacto, tlf, correo, description } = req.body;
  const newLink = {
    nameContacto,
    tlf,
    correo,
    description,
  };
  await pool.query("update contact set ? where id = ?", [newLink, id]);
  req.flash("succes", " Link editado correctamene");
  res.redirect("/links");
});

router.post("/buscar", isLoggedIn, async (req, res) => {
  const { nameContacto, user_id } = req.body;
  const contact = await pool.query(
    "SELECT * FROM contact WHERE nameContacto LIKE ? and user_id = ?",
    [`%${nameContacto}%`, user_id]
  );
  res.render("links/listaBuscar", { contact });
});

module.exports = router;
