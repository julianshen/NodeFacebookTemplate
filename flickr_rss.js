var restler = require('restler');
var sax = require('sax');
var util = require('util');

function parseFlickrUrl(url, cb) {
    var request = restler.get(url);
    request.on('complete', function(doc) {
        var parser = sax.parser(false);
        parser.onopentag = function(node) {
            if(node.name == 'LINK' && node.attributes.TYPE == 'application/rss+xml') {
                var rssLink = node.attributes.HREF;
                if(typeof(cb) == 'function') {
                    cb(rssLink);
                }
            } 
        };
        parser.write(doc).close();
    });
}

function parseFlickrRss(url, cb) {
    var request = restler.get(url);
    request.on('complete', function(doc) {
        var parser = sax.parser(false);
        var parseStack = [];
        var root = {};
        var currentObj = root;
        var currentText = null;

        parser.onopentag = function(node) {
            var tagName = node.name.toLowerCase();
            var obj = {};

            Object.keys(node.attributes).forEach(function(key) {
                obj[key.toLowerCase()] = node.attributes[key];
            });
            if(currentObj != null) {
                if(currentObj[tagName]) {
                    var a = currentObj[tagName];
                  
                    if(util.isArray(a)) {
                        a.push(obj);
                    } else {
                        var b = [];
                        b.push(a);
                        b.push(obj);
                        currentObj[tagName] = b;  
                    }
                } else {
                    currentObj[tagName] = obj;
                }
                parseStack.push(currentObj);
            }
    
            currentObj = obj;
            currentText = null;
        };
 
        parser.ontext = function(text) {
            if(currentText) {
                currentText += text;
            } else {
                currentText = text;
            } 
        };
 
        parser.onclosetag = function(tagName) {
            var parent = parseStack.pop();
            if(Object.keys(currentObj).length > 0) {
                currentObj.value = currentText;
            } else {
                parent[tagName.toLowerCase()] = currentText;
            }
            currentObj = parent;
        };

        parser.onend = function() {
            if(typeof(cb) == 'function') {
                cb(root.rss.channel);
            }
        };

        parser.write(doc).close();
    });
}

parseFlickrUrl('http://www.flickr.com/photos/julianshen/sets/72157629656940403/', function(link) {
    console.log(link);
    parseFlickrRss(link, function(data) {
        console.log('................');
        console.log(util.inspect(data, true, null));
    });
});
