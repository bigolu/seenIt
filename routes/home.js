/* This function renders the home page. */
var render_home = function(req, res){
	res.sendFile(require('path').join(__dirname, '/../views/home.html'));
}
exports.render_home = render_home;

/* Returns most popular place in given area */
var places = function(req, res){ 
	var request = require('request');

	var https = require('https');

	callback = function(response) {
	  var str = '';

	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  response.on('end', function () {
	  	j = JSON.parse(str);
	    console.log(j);
	    res.send(j);
	  });
	}

	var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + req.params.lat + ',' + req.params.lng + '&radius=500&key=AIzaSyCAGvyberFaujNn5pIm5XvdwlJpBAXVeiQ';
	console.log(url);
	https.get(url, callback);
}
exports.places = places;
