 function createHistogram(data, target){
    // declare margins
    // declare width and height with padding
    var margin = {top: 50, right: 10, bottom: 50, left: 10},
        parent_width = $(target).parent().width();
        width = parent_width - margin.left - margin.right,
        height = screen.height/3 - margin.top - margin.bottom;

    // create svg object and translate to be contained in margins
    var svg = d3.select(target).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var histogram_tooltip = d3.select(target).append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var color = "steelblue";

    // Generate a 1000 data points using normal distribution with mean=20, deviation=5
    var values = d3.range(1000).map(d3.random.normal(1000, 300));

    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var max = d3.max(values);
    var min = d3.min(values);
    var x = d3.scale.linear()
          .domain([min, max])
          .range([0, width]);

    // Generate a histogram using 15 uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(20))(values);

    var yMax = d3.max(data, function(d){return d.length});
    var yMin = d3.min(data, function(d){return d.length});
    var colorScale = d3.scale.linear()
                .domain([yMin, yMax])
                .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    var y = d3.scale.linear()
        .domain([0, yMax])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
        .on("mouseover", function(d){
            showHistogramTooltip(this,d);
        })
        .on("mouseout", function(d){
            hideHistogramTooltip();
        });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", (x(data[0].dx) - x(0)) - 1)
        .attr("height", function(d) { return height - y(d.y); })
        .attr("fill", function(d) { return colorScale(d.y) })
        .on("mouseover", function(d){
            d3.select(this)
                .attr("fill", "orange");
        })
        .on("mouseout", function(d){
            d3.select(this)
                .attr("fill", function(d) {
                    return colorScale(d.y);
                });
        });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -12)
        .attr("x", (x(data[0].dx) - x(0)) / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", (width * 0.005) + "em")
        .text(function(d) {
            if(d.y == yMax) return formatCount(d.y); 
        });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        // .attr("y", 0)
        .attr("x", 9)
        // .attr("dy", ".35em")
        .attr("transform", "rotate(45)");

    function showHistogramTooltip(c, d){
        var size  = d.length;

        // get the coordinates of the parent html object
        var parent_coord = $(target).position(),
            parent_x     = parent_coord["left"],
            parent_y     = parent_coord["top"];

        // get scroll offset
        var yOffset = $("#mySidenav").scrollTop(),
            xOffset = $("#mySidenav").scrollLeft();

        // create tooltip transition
        histogram_tooltip.transition().duration(200).style("opacity", .9);

        // calculate coordinates for tooltip
        var t  = d3.transform(d3.select(c).attr("transform")),
            x = t.translate[0] + parent_x + xOffset,
            y = t.translate[1] + parent_y + yOffset;

        // add text to tooltip and position it
        histogram_tooltip.html(size)
            .style("left", x + "px")     
            .style("top", y + "px");
    };

    function hideHistogramTooltip(){
        histogram_tooltip.transition().duration(200).style("opacity", 0);
    };
};