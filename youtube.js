var restler = require('restler');
var baseURL = 'https://gdata.youtube.com/feeds/api/';

function getStandardFeeds(feed, cb, regionID) {
   var standardFeedURL = baseURL + 'standardfeeds/' + (regionID ? (regionID+'/'):'') + feed;
   var request = restler.get(standardFeedURL, {query:'v=2&alt=jsonc'});
   
   request.on('complete', function(result) {
       cb(result.data ? result.data:result);
   });

}

function videos(querys, cb) {
   var videosURL = baseURL + 'videos';
   var queryStr = '';

   querys.forEach(function(key) {
       queryStr += key + '=' +querys[key] + '&';
   });

   var request = restler.get(videosURL, {query: queryStr});
   
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

videos({author:'SonyPictures', q:'trailer'}, function(data) {
});
