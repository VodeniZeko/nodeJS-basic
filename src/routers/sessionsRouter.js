const express = require("express");
const debug = require("debug")("app:sessionsRouter");
const { MongoClient, ObjectId } = require("mongodb");
const {username, password, host, database} = require('../../config');

const sessionsRouter = express.Router();

sessionsRouter.use((req,res,next) => {
  if(req.user){
    next();
  } else {
    res.redirect("/auth/signIn");
  }
})

sessionsRouter.route("/").get((req, res) => {
  const url = `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority&appName=${database}`;
  const dbName = `${database}`;

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug("Connected to the Mongo DB");

      const db = client.db(dbName);

      const sessions = await db.collection("sessions").find().toArray();
      res.render("sessions", { sessions });
    } catch (err) {
      debug("Could not connect to the server", err.stack);
    }
    client.close();
  })();
});

sessionsRouter.route("/:id").get((req, res) => {
  const id = req.params.id;

  const url = `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority&appName=${database}`;
  const dbName = `${database}`;

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug("Connected to the Mongo DB");

      const db = client.db(dbName);

      const session = await db.collection("sessions").findOne({ _id: new ObjectId(id) });
      res.render("session", { session });

    } catch (err) {
      debug("Could not connect to the server", err.stack);
      res.status(500).send("Internal Server Error");
    }
    client.close();
  })();
});

module.exports = sessionsRouter;
