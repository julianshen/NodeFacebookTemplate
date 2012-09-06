var restify = require('restify');  
var mongoose = require('mongoose/');
db = mongoose.connect('mongodb://localhost/mydb');
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

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
var server = restify.createServer();
server.use(restify.bodyParser());

//API
//test data
var Test1Schema = new Schema({
  title     : String
  , body      : String
});

var Test1 = mongoose.model('Test1', Test1Schema); 


function test(req, resp, next) {
    resp.send('test');
}

function addTest(req, resp, next) {
    var t1 = new Test1();
    t1.title = 'test';
    t1.body = '111';
    t1.save(function() {
        resp.send(t1);
    });
}

//Routing
//Index
server.get("/test", test);
server.get("/test2", addTest);

// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;
server.listen(port);
console.log('server run at port '  + port);
