const express = require("express");
const debug = require("debug")("app:authRouter");
const { MongoClient, ObjectId } = require("mongodb");
const {username, password, host, database} = require('../../config');

const authRouter = express.Router();

authRouter.route("/signup").post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const url = `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority&appName=${database}`;
    const dbName = `${database}`;

    res.json({username, password});

})

module.exports = authRouter;
