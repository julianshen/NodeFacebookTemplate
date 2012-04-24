var restler = require('restler');
var baseURL = 'https://gdata.youtube.com/feeds/api/';

function __resultCallback(request, cb) {
   request.on('complete', function(result) {
       if(typeof(cb)=='function') {
           cb(result.data ? result.data:result);
       }
   });
}

function __makeQueryStr(querys) {
   var queryStr = '';

   Object.keys(querys).forEach(function(key) {
       queryStr += key + '=' +querys[key] + '&';
   });

   queryStr += 'v=2&alt=jsonc';

   return queryStr;
}

function getStandardFeeds(feed, cb, regionID) {
   var standardFeedURL = baseURL + 'standardfeeds/' + (regionID ? (regionID+'/'):'') + feed;
   var request = restler.get(standardFeedURL, {query:'v=2&alt=jsonc'});
   
   __resultCallback(request, cb);
}

function videos(querys, cb, start) {
   var videosURL = baseURL + 'videos';
   if(start) querys['start-index']=start;

   var request = restler.get(videosURL, {query: __makeQueryStr(querys)});

   __resultCallback(request, cb);   
}

function related(video_id, cb, start) {
   var videoURL = baseURL + 'videos/' + video_id +'/related';
   var querys = {};

   if(start) querys['start-index']=start;

   var request = restler.get(videoURL, {query: __makeQueryStr(querys)});

   __resultCallback(request, cb);
}

var standardFeedNames = ['top_rated', 'top_favorites', 'most_viewed', 'most_shared', 'most_popular', 'most_recent', 'most_discussed', 'most_responded', 'recently_featured', 'on_the_web'];

var standardFeeds = {};

standardFeedNames.forEach(function(key) {
    standardFeeds[key] = function(cb, regionID) {
        getStandardFeeds(key, cb, regionID);
    };
}); 

var simpleYoutubeApi = {
    standardfeeds : standardFeeds,
    videos : videos,
    related : related
};

exports.simple = simpleYoutubeApi;
