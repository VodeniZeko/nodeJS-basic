//express is used for building web applications
const express = require("express");
//chalk is used for colorful console logs
const chalk = require("chalk");
//debug is used for logging..wait for it...debug messages
const debug = require("debug")("app");
//path is used for getting the path of the current directory
const path = require("path");
//morgan is used for logging requests to the console
const morgan = require("morgan");

const PORT = 3000;

const app = express();

app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "/public/")));

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello from basic NodeJS application!");
});

app.listen(PORT, () => {
  debug(`Listening on port ${chalk.green(PORT)}`);
});
