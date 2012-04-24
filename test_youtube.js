//Init Youtube Simple Interface
var Youtube = require('./youtube.js').simple;

//test standard feeds
//top rated
Youtube.standardfeeds.top_rated(function(data) {
    console.log('Top rated total items:' + data.totalItems);
});

//top rated, Japan
Youtube.standardfeeds.top_rated(function(data) {
    console.log('Top rated total items (JP):' + data.totalItems);
}, 'JP');

//most viewed
Youtube.standardfeeds.most_viewed(function(data) {
    console.log('Most viewed total items:' + data.totalItems);
});

//most viewed TW
Youtube.standardfeeds.most_viewed(function(data) {
    console.log('Most viewed total items (JP):' + data.totalItems);
}, 'TW');

//Test all feeds
console.log('Test standard feeds:');
Object.keys(Youtube.standardfeeds).forEach(function(func_name) {
   var func = Youtube.standardfeeds[func_name];
   func(function(data) {
       if(data) {
           console.log('Test ' + func_name + ' :' + ' [OK]');
       } else {
           console.log('Test ' + func_name + ' : [Fail]');
       }
  
   });
});

//Test other APIs
//Test video search
Youtube.videos({q: 'trailer'}, function(data) {
   console.log('Test video search : [OK]');
   if(data.totalItems && data.totalItems > 0) {
       //Test related
       Youtube.related(data.items[0].id, function(data) {
           console.log('Test related items: [OK]');
       });
   }
});
