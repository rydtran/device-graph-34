function createHeatMap(data, target, title, ylabel, xlabel){
    // declare margins
    // declare width and height with padding
    var margin = {top: 70, right: 20, bottom: 10, left: 60},
        parent_width = $(target).parent().width();
        width = parent_width - margin.left - margin.right,
        height = screen.height/3 - margin.top - margin.bottom;

    // create svg object and translate to be contained in margins
    var svg = d3.select(target).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var heat_tooltip = d3.select(target).append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var y_elements = d3.set(data.map(function(d) { return d.density; } )).values(),
        x_elements = d3.set(data.map(function(d) { return d.size; } )).values();

    var gridSize = createGridSize(x_elements, y_elements, width, height + margin.top);

    var xScale = d3.scale.ordinal()
        .domain(x_elements)
        .rangeBands([0, x_elements.length * gridSize]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickFormat(function (d) {
            return d;
        })
        .orient("top");

    var yScale = d3.scale.ordinal()
        .domain(y_elements.sort(function(a,b){return a - b;}))
        .rangeBands([0, y_elements.length * gridSize]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickFormat(function (d) {
            return d;
        })
        .orient("left");

    var colorScale = d3.scale.log()
        .domain(createRange(data,5))
        .range(["#4eb3d3", "#fdd49e", "#fc8d59", "#d7301f", "#7f0000"]);

    var cells = svg.selectAll('rect')
        .data(data)
        .enter().append('g').append('rect')
        .attr("rx", 3)
        .attr("ry", 3)
        .attr('class', 'cell')
        .attr('width', gridSize - 1)
        .attr('height', gridSize - 1)
        .attr('y', function(d) { return yScale(d.density); })
        .attr('x', function(d) { return xScale(d.size); })
        .attr('fill', function(d) { return colorScale(d.value); })
        .on("mouseover", function(d) {
            showHeatTooltip(this,d);
        })
        .on("mouseout", function(d){
            hideHeatTooltip();
        });;

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal');

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style("text-anchor", "start")
        .attr("dx", ".8em")
        .attr("dy", ".5em")
        .attr("transform","rotate(-65)");

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
        .attr("y", -margin.top + 15)
        .style("text-anchor", "middle")
        .text(xlabel);

    function showHeatTooltip(c, d){
        var size  = d.size,
            value = d.value,
            density = d.density
            bot_margin = 20;

        // get the coordinates of the parent html object
        var parent_coord = $(target).position(),
            parent_x     = parent_coord["left"],
            parent_y     = parent_coord["top"];

        // get scroll offset
        var yOffset = $("#mySidenav").scrollTop(),
            xOffset = $("#mySidenav").scrollLeft();

        // create tooltip transition
        heat_tooltip.transition().duration(200).style("opacity", .9);

        // calculate coordinates for tooltip
        var x = parseInt(c.getAttribute("x")) + parent_x + xOffset + parseInt(c.getAttribute("width")),
            y = parseInt(c.getAttribute("y")) + parent_y + yOffset;

        // add text to tooltip and position it
        heat_tooltip.html(
                     "</p><p class='left-align'>"+ xlabel +":<span class='right-align'>" + size +
                     "</p><p class='left-align'>"+ ylabel +"<span class='right-align'>" + density +
                     "</p><p class='left-align'>Nodes:<span class='right-align'>" + value)
            .style("left", x + "px")     
            .style("top", y + "px");
    };

    function hideHeatTooltip(){
        heat_tooltip.transition().duration(200).style("opacity", 0);
    };

    function createRange(data, indicies){
        var diff = Math.floor(d3.max(data, function(d){return d.value;}) / (indicies - 1));
        var range = [];
        var entry = 1e-6;

        for(var i = 0; i < indicies; i++){
            range.push(entry);
            entry = entry + diff;
        }

        return range;
    };

    function createGridSize(x,y,width,height){
        var x_size = x.length,
            y_size = y.length,
            diff = (x_size >= y_size) ? x_size : y_size,
            container_size = (width <= height) ? width : height;

        var size = Math.floor(container_size/diff);

        return size;
    };
};