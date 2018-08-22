var LOCATIONS_FOUND = false;
var TIPUE_LOCATIONS = [];

$(document).ready(function() {
     $('#tipue_search_input').tipuesearch();
});

function found_callback(){
	LOCATIONS_FOUND = true;
}

function found_locations(results, callback){
	for(var i = 0; i < results.length; i++){
		TIPUE_LOCATIONS.push(results[i]['title']);
	};
	console.log(results);
	console.log(TIPUE_LOCATIONS);
	callback();
};