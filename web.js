require('ejs');
var express = require('express');

var app = express.createServer(
  express.logger(),
  express.static(__dirname + '/public'),
  express.bodyParser(),
  express.cookieParser(),
  // set this to a secret value to encrypt session cookies
  express.session({ secret: process.env.SESSION_SECRET || 'secret123' })
);

app.set('view engine', 'ejs');
app.get('/', function(req,res) {
  res.render('index.ejs', {
        layout:    false,
        req:       req,
        app:       app,
      });
});


app.listen(3000);
