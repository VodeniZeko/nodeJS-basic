const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require("mongodb");
const debug = require("debug")("app:localStrategy");

const config = require('../../../config');


module.exports = function localStrategy() {
    passport.use(new Strategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {

        const url = `mongodb+srv://${config.username}:${config.password}@${config.host}/?retryWrites=true&w=majority&appName=${config.database}`;
        const dbName = `${config.database}`;

        (async function validateUser(){
            let client;

            try {
                client = await MongoClient.connect(url);
                debug("Connected to the Mongo DB");

                const db = client.db(dbName);
    
                const users = db.collection("users");
    
                const existingUser = await users.findOne({username});

                if (existingUser && existingUser.password == password) {
                    done(null, existingUser);
                } else {
                    done(null, false);
                }


            } catch (error) {
                done(error,false)
            }
            client.close();
        }())

    }))
}
