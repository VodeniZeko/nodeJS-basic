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

const sessions = require("./src/data/sessions.json");
const PORT = process.env.PORT || 3000;
const app = express();
const sessionsRouter = express.Router();

app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "/public/")));

app.set("views", "./src/views/");
app.set("view engine", "ejs");

sessionsRouter.route('/').get((req,res) => {
    res.render("sessions", {
      sessions,
    },)})

sessionsRouter.route('/:id').get((req,res) => {
  const id = req.params.id;
    res.send(`hello from ${id}`)
})
app.use("/sessions", sessionsRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.render("index", {
    title: "the homepage!",
    data: ["one", "two", "three"],
  });
});

app.listen(PORT, () => {
  debug(`Listening on port ${chalk.green(PORT)}`);
});
