var lat_end; //latitude for destination
var long_end; //longitude for destination
var lat_start = ''; //latitude for origin
var long_start; //longitude for origin
var old_places = []; //previous list of possibilities
var places = []; //possible places to go
var stops; //number of stops allowed
var s; //number of stops made
var curr; //current location

/* Displays map on page */
function show_map(){
	directionsDisplay = new google.maps.DirectionsRenderer();
	var united_states = new google.maps.LatLng(41.850033, -87.6500523);
	var mapOptions = { //parameters for creating a map
    zoom:4,
    center: united_states
  	};
  	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions); //select where to put the map on the page
  	directionsDisplay.setMap(map);
  	directionsDisplay.setPanel(document.getElementById("directionsPanel")); //select where to put directions on the page
};


function setup(){
  	stops = Number(document.getElementById("stops").value);

  	var xhr = new XMLHttpRequest();
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + document.getElementById("from").value + "&key=AIzaSyAFXNrOH6LjH8eO-klJs4AynqJU0dADpNE";
	xhr.open("GET", url, false);
	xhr.onreadystatechange = function() {
  		if (xhr.readyState == 4) {
    	var loc = JSON.parse(xhr.responseText);
    	console.log(loc.results[0].geometry.location);
    	lat_start = loc.results[0].geometry.location.lat;
    	long_start = loc.results[0].geometry.location.lng;
  		}
	}
	xhr.send(); 

	var xhr = new XMLHttpRequest();
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + document.getElementById("to").value + "&key=AIzaSyAFXNrOH6LjH8eO-klJs4AynqJU0dADpNE";
	xhr.open("GET", url, false);
	xhr.onreadystatechange = function() {
  		if (xhr.readyState == 4) {
    	var loc = JSON.parse(xhr.responseText);
    	lat_end = loc.results[0].geometry.location.lat;
    	long_end = loc.results[0].geometry.location.lng;
  		}
	}
	xhr.send(); 

	curr = { lat: Number(lat_start), lng: Number(long_start) };

	lat_diff = Math.abs(lat_start - lat_end);
	long_diff = Math.abs(long_start - long_end);
	lat_increment = lat_diff/(stops + 1);
	long_increment = long_diff/(stops + 1);

	console.log('lat' + lat_increment);
	console.log('long' + long_increment);

	s = 0;
	get_places();
}

function get_places(){
	if(s > stops){
		document.getElementById("all_places").innerHTML = '';
		return done();
	}

	s = s + 1;
	var lat;
	var lng;

	if(lat_start > lat_end){ 
		lat = lat_start - (lat_increment * s);
	}
	else{
		lat = lat_start + (lat_increment * s);
	}

	if(long_start > long_end){ 
		lng = long_start - (long_increment * s);
	}
	else{
		console.log(long_start + '/' + long_end)
		lng = long_start + (long_increment * s);
	}

  	var xhr = new XMLHttpRequest();
	var url = '/places/' + lat + '/' + lng;
	xhr.open("GET", url, false);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	  	var inner = '';
	    var p = JSON.parse(xhr.responseText);
	    old_places = places;
	    places = p.results;

	    for(i = 0; i < places.length && i < 10; i++){
	    	inner += '<li onClick="get_places(); stop_route(this.id)" id="' + i + '">' + places[i].name + '</li>';
	    	document.getElementById("all_places").innerHTML = inner;
	    }

	  }
	}
	xhr.send();
}

function stop_route(id){
	console.log('stop');
	var directionsService = new google.maps.DirectionsService();

	var stop = old_places[Number(id)].geometry.location;

	var request = {
		origin: curr.lat + ',' + curr.lng,
		destination: stop.lat + ',' + stop.lng,
		travelMode: google.maps.TravelMode.DRIVING
  	};
  	directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(response)
	    }
	    else{	
	    	console.log(status);
	    }
  	});

  	curr = stop;
}

function done(){
	console.log('done');
	var directionsService = new google.maps.DirectionsService();

	var request = {
		origin: curr.lat + ',' + curr.lng,
		destination: lat_end + ',' + long_end,
		travelMode: google.maps.TravelMode.DRIVING
  	};
  	directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(response)
	    }
  	});
}

google.maps.event.addDomListener(window, 'load', show_map); //init_map once page is loaded
