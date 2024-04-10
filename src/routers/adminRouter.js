const express = require('express');
const debug = require('debug')('app:adminRouter');
const { MongoClient } = require('mongodb');
const sessions = require("../data/sessions.json");
const {username, password, host, database} = require('../../config');

const adminRouter = express.Router();

adminRouter.route('/').get((req, res) => {
    const url = `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority&appName=${database}`;
    const dbName = `${database}`;

    (async function mongo(){
        let client;
        try{
            client = await MongoClient.connect(url);
            debug('Connected to the Mongo DB');

            const db = client.db(dbName); 

            const response = await db.collection('sessions').insertMany(sessions);
            res.json(response);
            
        } catch (err) {
            debug('Could not connect to the server', err.stack);
        }
    }())
})

module.exports = adminRouter;
