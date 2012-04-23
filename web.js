require('ejs');
var Youtube = require('./youtube').simple;
var express = require('express');

var app = express.createServer(
  express.logger(),
  express.static(__dirname + '/public'),
  express.bodyParser(),
  express.cookieParser(),
  // set this to a secret value to encrypt session cookies
  express.session({ secret: process.env.SESSION_SECRET || 'mysecret11' }),
  require('faceplate').middleware({
    app_id: process.env.FACEBOOK_APPID,
    secret: process.env.FACEBOOK_SECRET
  })
);


app.set('view engine', 'ejs');


//Routing
//Index
app.get('/', function(req,res) {
  Youtube.videos({author: 'SonyPictures', q:'trailer'},function(data) {
      res.render('index.ejs', {
        layout:    'layouts/facebook_common.ejs',
        req:       req,
        app:       app,
        trailers:  data
      });
  });
});

//Facebook channel files
app.get('/_channel', function(req, res) {
  var cache_expire = 60*60*24*365;
  res.header('Pragma: public');
  res.header('Cache-Control: max-age='+cache_expire);
  res.header('Content-type: text/html');
  res.send('<script src="//connect.facebook.net/en_US/all.js"></script>');
});

//For test
app.get('/__events', function(req, res) {
  req.facebook.get('/me/events', { limit: 4 }, function(events) {
    res.send('events: ' + require('util').inspect(events));
  });
});

app.get('/__youtube_to', function(req, res) {
  Youtube.videos({author: 'SonyPictures', q:'trailer'},function(data) {
    res.send(data);
  });
});


// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;
app.listen(port);
