const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../databases");
const helpers = require("../lib/helpers");

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const row = await pool.query("select * from users where username = ?", [
        username,
      ]);
      if (row.length > 0) {
        const user = row[0];
        const validarUsuario = await helpers.comparePassword(
          password,
          user.password
        );
        if (validarUsuario) {
          done(null, user, req.flash("succes", "Bienvenido " + user.username));
        } else {
          done(null, false, req.flash("message", "Contraseña incorrecta"));
        }
      } else {
        return done(
          null,
          false,
          req.flash("message", "El nombre de usuario no existe")
        );
      }
    }
  )
);

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const { fullname } = req.body;
      const newUser = {
        username,
        password,
        fullname,
      };

      const row = await pool.query("select* from users where username = ?", [
        newUser.username,
      ]);
      if (row.length > 0) {
        done(
          null,
          false,
          req.flash("message", "El nombre de usuario ya existe")
        );
      } else {
        newUser.password = await helpers.encryptPassword(password);
        const resultado = await pool.query("insert into users set ?", [
          newUser,
        ]);
        newUser.id = resultado.insertId;
        return done(null, newUser, req.flash("message", "Registro con exito"));
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query("select * from users where id =?", [id]);
  done(null, rows[0]);
});
