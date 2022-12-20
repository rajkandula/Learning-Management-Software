// Setup server, session and middleware here.
// Setup server, session and middleware here.
const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");

const exphbs = require("express-handlebars");

const static = express.static(__dirname + "/public");
app.use("/public", static);

//app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//session expire
app.use(session({ secret: "Key", cookie: { maxAge: 600000 } }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

//middleware
const myLogger = function (req, res, next) {
  auth = "(Non-Authenticated User)";
  if (req.session.user) {
    auth = "(Authenticated User)";
  }
  console.log(
    "[" + new Date().toUTCString() + "]: ",
    req.method,
    req.originalUrl,
    auth
  );
  next();
};
app.use(myLogger);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
