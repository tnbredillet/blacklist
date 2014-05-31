var express = require('express');
var exHb    = require("express3-handlebars");
var controllers = require(__dirname + "/controllers");
var config = require(__dirname + "/config");
var path = require('path');
var mw = require(__dirname + "/middleware");

var app = express();

// Mustache engine
app.engine("handlebars", exHb({
  defaultLayout : "main",
  helpers       : require(__dirname + "/presenters/header.js")
}));
app.set("view engine", "handlebars");


// Sessions (@TODO: update keys)
app.use(express.cookieParser(config.Cookie.Secret));
app.use(express.cookieSession({ secret: config.Session.Secret, cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }}));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'views/public')));

// Middleware to check authentication state
var publicRoutes = [
  "/",
  "/login",
  "/healthcheck",
  "/signup"
];
app.all("/*", mw.checkSessions(publicRoutes));


app.get("/", controllers.home);
app.post("/", controllers.home);
app.get("/healthcheck", controllers.healthcheck);
app.get("/login", controllers.login);
app.post("/login", controllers.login);

//User routes
app.get("/user/signout", controllers.user.signout);
app.get("/user/home", controllers.user.home);
app.get("/user/profile", controllers.user.profile);
app.post("/user/profile", controllers.user.updateProfile);

//List routes
app.get("/user/listData", controllers.list.listData);
app.get("/lists/:id", controllers.list.show);

//Votes routes
app.post("/votes", controllers.vote.create)


app.listen(config.FinestLife.port);
console.log('Listening on port '+ config.FinestLife.port );
