const express = require("express");
const debug = require("debug")("app:authRouter");
const { MongoClient, ObjectId } = require("mongodb");
const config = require('../../config');

const authRouter = express.Router();

authRouter.route("/signup").post((req, res) => {
    const {username, password} = req.body;

    const url = `mongodb+srv://${config.username}:${config.password}@${config.host}/?retryWrites=true&w=majority&appName=${config.database}`;
    const dbName = `${config.database}`;

    (async function addUser() {
        let client;
        try {
            client = await MongoClient.connect(url);

            const db = client.db(dbName);

            const users = db.collection("users");

            const existingUser = await users.findOne({username});

            if (existingUser) return res.status(432).json({message: "User already exists"});

            const result = await users.insertOne({
                username,
                password,
                date: new Date()

            })

            debug('results are HERE',result);
            req.logIn(result, () => {
                res.redirect('/auth/profile')
            })

        } catch (error)
        {
            debug(error);
        }
    }())
})

authRouter.route("/profile").get((req, res) => {
    const { user } = req;
    res.json({ user });
})

module.exports = authRouter;
