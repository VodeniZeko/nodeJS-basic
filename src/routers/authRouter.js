const express = require("express");
const passport = require("passport");
const debug = require("debug")("app:authRouter");
const { MongoClient } = require("mongodb");
const config = require("../../config");

const authRouter = express.Router();

authRouter.route("/signup").post((req, res) => {
  const { username, password } = req.body;

  const url = `mongodb+srv://${config.username}:${config.password}@${config.host}/?retryWrites=true&w=majority&appName=${config.database}`;
  const dbName = `${config.database}`;

  (async function createUser() {
    let client;
    try {
      client = await MongoClient.connect(url);
  
      const db = client.db(dbName);
      const user = { username, password };
      const results = await db.collection('users').insertOne(user);
      
      if (!results.insertedId) {
        throw new Error("Insert operation didn't return expected results.");
      }
  
      debug(results);
      const insertedId = results.insertedId;
  
      const insertedUser = await db.collection('users').findOne({ _id: insertedId });
  
      if (!req || !res) {
        throw new Error("Request or response objects are not available.");
      }
  
      req.login(insertedUser, () => {
        res.redirect('/auth/profile');
      });
  
    } catch (error) {
      debug(error);
    } finally {
      if (client) {
        client.close();
      }
    }
  })();
  
});

authRouter
  .route("/signIn")
  .get((req, res) => {
    res.render("signIn");
  })
  .post(
    passport.authenticate("local", {
      successRedirect: "/auth/profile",
      failureRedirect: "/",
    })
  );

authRouter.route("/profile").get((req, res) => {
    const user = req.user;
    if(user){
        res.render("profile",{user})
      } else {
        res.redirect("/auth/signIn");
      }
});

module.exports = authRouter;
