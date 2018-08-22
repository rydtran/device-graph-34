function createLineChart(data, target, title, ylabel, xlabel){
    // declare margins
    // declare width and height with padding
    var margin = {top: 50, right: 20, bottom: 50, left: 60},
        parent_width = $(target).parent().width();
        width = parent_width - margin.left - margin.right,
        height = screen.height/3 - margin.top - margin.bottom;

    // create svg object and translate to be contained in margins
    var svg = d3.select(target).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on("mouseout", function(d){
            hideGraphTooltip();
        });

    var graph_tooltip = d3.select(target).append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    // Set the ranges
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left");

    // initialize a focus group
    var focus = svg.append("g") 
        .style("display", "none");

    var bisectDate = d3.bisector(function(d) { return d.size; }).left;

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.size); })
        .y(function(d) { return y(d.value); });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.size; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add Y label
    svg.append("text")
        .style("fill", "grey")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", -margin.left/(1.2))
        .style("text-anchor", "middle")
        .text(ylabel);

    // Add X label
    svg.append("text")
        .style("fill", "grey")
        .attr("x", width/2)
        .attr("y", height + margin.bottom/1.2)
        .style("text-anchor", "middle")
        .text(xlabel);

    // Add title
    svg.append("text")
        .style("fill", "grey")
        .attr("x", width/2)
        .attr("y", -margin.top/1.5)
        .style("text-anchor", "middle")
        .html(title)

    // create focus line
    // append the x line
    focus.append("line")
        .attr("class", "x")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", 0)
        .attr("y2", height);

    // append the y line
    focus.append("line")
        .attr("class", "y")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", width)
        .attr("x2", width);

    // append the circle at the intersection
    focus.append("circle")
        .attr("class", "y")
        .style("fill", "none")
        .style("stroke", "blue")
        .attr("r", 4);

    // append the rectangle to capture mouse
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i] == undefined ? data[i-1] : data[i],
            d = x0 - d0.size > d1.size - x0 ? d1 : d0;

        focus.select("circle.y")
            .attr("transform",
                  "translate(" + x(d.size) + "," +
                                 y(d.value) + ")");

        focus.select(".x")
            .attr("transform",
                  "translate(" + x(d.size) + "," +
                                 y(d.value) + ")")
                       .attr("y2", height - y(d.value));

        focus.select(".y")
            .attr("transform",
                  "translate(" + width * -1.1 + "," +
                                 y(d.value) + ")")
                       .attr("x2", width + width);

        var c = focus.select("circle.y")[0][0];
        showGraphTooltip(c, d);
    };

    function showGraphTooltip(c, d){
        var size  = d.size,
            value = d.value,
            bot_margin = 20;

        // get the coordinates of the parent html object
        var parent_coord = $(target).position(),
            parent_x     = parent_coord["left"],
            parent_y     = parent_coord["top"];

        // get scroll offset
        var yOffset = $("#mySidenav").scrollTop(),
            xOffset = $("#mySidenav").scrollLeft();

        // create tooltip transition
        graph_tooltip.transition().duration(200).style("opacity", .9);

        // calculate coordinates for tooltip
        var t  = d3.transform(d3.select(c).attr("transform")),
            x = t.translate[0] + parent_x + xOffset,
            y = t.translate[1] + parent_y + yOffset - bot_margin;

        // add text to tooltip and position it
        graph_tooltip.html(
                     "</p><p class='left-align'>"+ xlabel +":<span class='right-align'>" + size +
                     "</p><p class='left-align'>Nodes:<span class='right-align'>" + value)
            .style("left", x + "px")     
            .style("top", y + "px");
    };

    function hideGraphTooltip(){
        graph_tooltip.transition().duration(200).style("opacity", 0);
    };
};

function createBarChart(data, target, title, ylabel, xlabel){
    // declare margins
    // declare width and height with padding
    var margin = {top: 50, right: 20, bottom: 50, left: 60},
        parent_width = $(target).parent().width();
        width = parent_width - margin.left - margin.right,
        height = screen.height/3 - margin.top - margin.bottom;

    // create svg object and translate to be contained in margins
    var svg = d3.select(target).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var graph_tooltip = d3.select(target).append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    // Set the ranges
    var x = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.size; }))
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .domain([0, 30000])
        .range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.size); })
        .attr("y", function(d) { return y(d.value);})
        .attr("width", x.rangeBand())
        .attr("height", function(d) { return height - y(d.value); });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("id", "myXAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add Y label
    svg.append("text")
        .style("fill", "grey")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", -margin.left/(1.2))
        .style("text-anchor", "middle")
        .text(ylabel);

    // Add X label
    svg.append("text")
        .style("fill", "grey")
        .attr("x", width/2)
        .attr("y", height + margin.bottom/1.2)
        .style("text-anchor", "middle")
        .text(xlabel);

    // Add title
    svg.append("text")
        .style("fill", "grey")
        .attr("x", width/2)
        .attr("y", -margin.top/1.5)
        .style("text-anchor", "middle")
        .html(title);
};