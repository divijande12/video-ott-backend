const db = require("../models");
const config = require("../config/auth.config");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  "382026133381-fk52usmsprkhk68l1kri82riamkgfpp4.apps.googleusercontent.com"
);
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.googleLogin = (req, response) => {
  const { tokenId } = req.body;

  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "382026133381-fk52usmsprkhk68l1kri82riamkgfpp4.apps.googleusercontent.com",
    })
    .then((res) => {
      const { email_verified, name, email } = res.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          } else {
            if (user) {
              var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400, //24hours
              });
              var authorites = [];
              for (let i = 0; i < user.roles.length; i++) {
                authorites.push("ROLE_" + user.roles[i].name);
              }
              response.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorites,
                accessToken: token,
              });
            } else {
              let password = email + config.secret;
              const newUser = new User({ username: name, email, password });
              newUser.save((err, user) => {
                if (err) {
                  response.status(500).send({ message: err });
                  return;
                }
                var token = jwt.sign({ id: user.id }, config.secret, {
                  expiresIn: 86400, //24hours
                });
                var authorites = [];
                for (let i = 0; i < user.roles.length; i++) {
                  authorites.push("ROLES_" + user.roles[i].name.toUpperCase());
                }
                response.status(200).send({
                  id: user._id,
                  username: user.username,
                  email: user.email,
                  roles: authorites,
                  accessToken: token,
                });
              });
            }
          }
        });
      }
    });
};
