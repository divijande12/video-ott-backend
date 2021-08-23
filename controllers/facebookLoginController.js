const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { default: fetch } = require("node-fetch");

exports.facebooklogin = (req, response) => {
  const { userID, accessToken } = req.body;

  let urlGraphFacebook = `https://graph.facebook.com/v11.0/${userID}/?fields=id,name,email&access_token=${accessToken}`;
  fetch(urlGraphFacebook, { method: "GET" })
    .then((res) => res.json())
    .then((res) => {
      const { email, name } = res;
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
              authorites.push("ROLES_" + user.roles[i].name.toUpperCase());
            }
            response.status(200).send({
              id: user._id,
              username: user.username,
              email: user.email,
              roles: authorites,
              accessToken: token,
            });
          } else {
            let password = config.secret;
            let newUser = new User({ username: name, email, password });
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
                email: email,
                roles: authorites,
                accessToken: token,
              });
            });
          }
        }
      });
    });
};
