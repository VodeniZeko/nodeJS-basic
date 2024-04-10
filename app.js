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
//passport is used for authentication
const passport = require("passport");
//cookieParser is used for parsing cookies
const cookParser = require("cookie-parser");
//session is used for maintaining user sessions
const session = require("express-session");

;
const PORT = process.env.PORT || 3000;
const app = express();
const sessionsRouter = require("./src/routers/sessionsRouter");
const adminRouter = require("./src/routers/adminRouter");
const authRouter = require("./src/routers/authRouter");

//middleware
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "/public/")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookParser());
app.use(session({ secret: "secret" }));

require("./src/config/passport.js")(app);

app.set("views", "./src/views/");
app.set("view engine", "ejs");

app.use("/sessions", sessionsRouter);
app.use("/admin", adminRouter);
app.use("/auth",authRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  debug(`Listening on port ${chalk.green(PORT)}`);
});
