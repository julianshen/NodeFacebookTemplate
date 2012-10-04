var cons = require('consolidate');
var Youtube = require('./youtube').simple;
var express = require('express');

//Initialize upload folder
var uploadFolder = __dirname + '/uploads'
var fs = require('fs');

try {
    var stat = fs.statSync(uploadFolder);
} catch(e) {
    //Assume folder not created
    fs.mkdirSync(uploadFolder);
}

//Init server
var app = express();
app.use(express.logger());
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser({uploadDir: uploadFolder}));
app.use(express.cookieParser());
  // set this to a secret value to encrypt session cookies
app.use(express.session({ secret: process.env.SESSION_SECRET || 'mysecret11' }));
app.use(require('faceplate').middleware({
    app_id: process.env.FACEBOOK_APPID,
    secret: process.env.FACEBOOK_SECRET
    scope: 'user_activities,user_checkins,user_likes,user_photos,user_status,read_stream,publish_checkins,publish_stream,publish_actions'
 
  })
);


// assign the swig engine to .ejs files
app.engine('ejs', cons.qejs);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//Routing
//Index
app.get('/', function(req,res) {
/*  Youtube.videos({author: 'SonyPictures', q:'trailer'},function(data) {
      res.render('index.ejs', {
        req:       req,
        app:       app,
        trailers:  data
      });
  });
*/
    res.render('index2.ejs', {
        req: req,
        app: app,
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

//File upload
app.get('/upload', function(req, res) {
  res.render('upload.ejs', {
        req:       req,
        app:       app,
      });
});

app.post('/_upload', function(req, res) {
    if(req.files.upload) {
        //TODO: add file info to database?
    }

    res.send('{}');
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
