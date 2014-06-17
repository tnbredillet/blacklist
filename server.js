var express = require('express');
var Bookshelf  = require('bookshelf')
var config = require(__dirname + "/config");

Bookshelf.PG = Bookshelf.initialize({
  client: 'pg',
  connection: config.PG.PG_URL
});

var exHb    = require("express3-handlebars");
var cookieParser = require('cookie-parser');
var routes = require(__dirname + "/routes");
var path = require('path');
var session = require('cookie-session')
var bodyParser = require('body-parser')






var app = express();

// Mustache engine
app.engine("handlebars", exHb({
  defaultLayout : "main",
  helpers       : require(__dirname + "/presenters/index.js")
  
}));
app.set("view engine", "handlebars");


// Sessions (@TODO: update keys)
app.use(cookieParser(config.Cookie.Secret));
app.use(session({ secret: config.Session.Secret, cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }}));
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'views/public')));

routes(app)

app.listen(config.port);
console.log('Listening on port '+ config.port );
