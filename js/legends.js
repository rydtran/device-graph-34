function create_legend(target){

	var parent_width = $(target).parent().width();

	var margin = {top: 00, right: 10, bottom: 20, left: 10},
	    width = parent_width - 15 - margin.left - margin.right,
	    height = screen.height/14 - margin.top - margin.bottom;

	// create svg object and translate to be contained in margins
	var svg = d3.select(target).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Append a defs (for definition) element to your SVG
	var defs = svg.append("defs");

	//Append a linearGradient element to the defs and give it a unique id
	var linearGradient = defs.append("linearGradient")
	    .attr("id", "linear-gradient")
	    .attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "100%")
	    .attr("y2", "0%");

	//A color scale
	var colorScale = d3.scale.linear()
	    .range(["#4eb3d3", "#fdd49e", "#fc8d59", "#d7301f", "#7f0000"]);

	//Append multiple color stops by using D3's data/enter step
	linearGradient.selectAll("stop")
	    .data( colorScale.range() )
	    .enter().append("stop")
	    .attr("offset", function(d,i) { return i/(colorScale.range().length-1); })
	    .attr("stop-color", function(d) { return d; });

	svg.append("rect")
	    .attr("width", width)
	    .attr("height", height)
	    .style("fill", "url(#linear-gradient)");

	//Set scale for x-axis
	var xScale = d3.scale.linear()
		 .range([0, width])
		 .domain([0,1]);
		 //.domain([d3.min(pt.legendSOM.colorData)/100, d3.max(pt.legendSOM.colorData)/100]);

	//Define x-axis
	var xAxis = d3.svg.axis()
		  .orient("bottom")
		  .ticks(5)  //Set rough # of ticks
		  //.tickFormat(formatPercent)
		  .scale(xScale);

	//Set up X axis
	svg.append("g")
		.attr("class", "axis")  //Assign "axis" class
		.attr("transform", "translate(" + 0 + "," + height + ")")
		.call(xAxis);
};