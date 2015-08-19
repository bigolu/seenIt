/* This function renders the home page. */
var render_home = function(req, res){
	res.sendFile(require('path').join(__dirname, '/../front-end/index.html'));
}
exports.render_home = render_home;

/* Returns most popular places in given area */
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

	var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + req.params.lat + ',' + req.params.lng + '&radius=48280.3&types=amusement_park|aquarium|museum|zoo|park&key=AIzaSyCAGvyberFaujNn5pIm5XvdwlJpBAXVeiQ';
	console.log(url);
	https.get(url, callback);
}
exports.places = places;

function render_go(req, res){
	res.sendFile(require('path').join(__dirname, '/../views/go.html'));
}
exports.render_go = render_go;
