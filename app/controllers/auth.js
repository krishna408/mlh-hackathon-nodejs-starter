const express = require("express");

const config = require("../../config");
const User = require("../models/user");
const GitHub = require("../services/github");

const router = express.Router();

router.get("/logout", function(req, res) {
  // TODO
});

router.get("/login/github", function(req, res) {
  const github = new GitHub(config.githubClientId, config.githubClientSecret);
  res.redirect(github.authorization_url("public_repo"));
});

router.get("/callback/github", async function(req, res) {
  if (!req.query.code) {
    return res.render("500");
  }

  // Fetch user from GitHub OAuth and store in session
  const github = new GitHub(config.githubClientId, config.githubClientSecret);
  const access_token = await github.get_token(req.query.code);

  if (!access_token) {
    return res.render("404");
  }

  const user = User.find_or_create_from_token(access_token);

  return res.redirect("/");
});

module.exports = router;
