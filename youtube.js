var restler = require('restler');
var baseURL = 'https://gdata.youtube.com/feeds/api/';

function getStandardFeeds(feed, cb, regionID) {
   var standardFeedURL = baseURL + 'standardfeeds/' + (regionID ? (regionID+'/'):'') + feed;
   var request = restler.get(standardFeedURL, {query:'v=2&alt=jsonc'});
   
   request.on('complete', function(result) {
       cb(result.data ? result.data:result);
   });

}

function videos(querys, cb, start) {
   var videosURL = baseURL + 'videos';
   var queryStr = '';

   Object.keys(querys).forEach(function(key) {
       queryStr += key + '=' +querys[key] + '&';
   });
   queryStr += 'v=2&alt=jsonc';
   if(start) queryStr += '&start-index='+start;

   var request = restler.get(videosURL, {query: queryStr});
   
   request.on('complete', function(result) {
       cb(result.data ? result.data:result);
   });
}

function related(video_id, cb, start) {
   var videoURL = baseURL + 'videos/' + video_id +'/related';

   var queryStr = 'v=2&alt=jsonc';
   if(start) queryStr += '&start-index='+start;

   var request = restler.get(videoURL, {query: queryStr});

   request.on('complete', function(result) {
       cb(result.data ? result.data:result);
   });
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
