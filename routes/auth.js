const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.post("/login", (req, res, next) => {
  const myFunction =
    passport.authenticate("local", (err, theUser) => {
      if (err) {
        next(err);
        return;
      }

      if (!theUser) {
        const err = new Error("Log in failed!");
        err.status = 400;
        next(err);
        return;
      }

      req.login(theUser, () => {
        // clear the password before sending (it's a security risk)
        theUser.password = undefined;
        res.json({ userInfo: theUser });
      });
    });

  myFunction(req, res, next);
});


authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const rol = req.body.role;
  if (username === "" || password === "") {
    const err = new Error("Username or password invalid");
    err.status = 400;
    next(err);
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      const err = new Error("The username already exists");
      err.status = 400;
      next(err);
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role:"teacher"
    });

    newUser.save((err) => {
      if (err) {
        next(err);
      } else {
        // login the user immediately after they've signed up
        req.login(newUser, () => {
          // clear the password before sending (it's a security risk)
          newUser.password = undefined;
          res.json({ userInfo: newUser });
        });
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.json({ userInfo: null });
});

authRoutes.get("/checklogin", (req, res, next) => {
  if (req.user) {
    // clear the password before sending (it's a security risk)
    req.user.password = undefined;
  }

  res.json({ userInfo: req.user });
});

module.exports = authRoutes;
