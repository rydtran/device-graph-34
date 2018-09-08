// uses global variable "FORCE_DATA" from main.js
// uses global variable "CIRCLE_DATA" from main.js
// uses global variable "LOCATIONS_FOUND" from search.js
// uses global variable "TIPUE_LOCATIONS" from search.js

function circlePack(){

    // remove the force or weighted layout
    removeElement("force_layout");
    removeElement("weighted_layout");

    // if user tries to create another circle pack
    var old = document.getElementById("circle_pack");
    if(old != null) return;

    updateTab("circle");

    var html = '<div id="circle_pack"></div>';
    addElement("vis_area","div","row","circle_pack",html);
    var root = CIRCLE_DATA;

    var margin = 10,
        outerDiameter = 960,
        innerDiameter = outerDiameter - margin - margin;

    var x = d3.scale.linear()
        .range([0, innerDiameter]);

    var y = d3.scale.linear()
        .range([0, innerDiameter]);

    var color = d3.scale.linear()
        .domain([-1, 5])
        .range(["#e1f4fd", "#00aeef"])
        .interpolate(d3.interpolateHcl);

    var pack = d3.layout.pack()
        .padding(2)
        .size([innerDiameter, innerDiameter])
        .value(function(d) { return d.size; })

    var svg = d3.select("#circle_pack").append("svg")
        .attr("width", outerDiameter)
        .attr("height", outerDiameter)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");

    var circle_tooltip = d3.select("#circle_pack").append("div")   
        .attr("class", "tooltip")
        .style("opacity", 0);

    var density_color = d3.scale.linear()
        .domain([0, 1, 2, 3, 4])
        .range(["#4eb3d3", "#fdd49e", "#fc8d59", "#d7301f", "#7f0000"])
        .interpolate(d3.interpolate);

    function filter(data, size){
        if(data.children == undefined) return;
        data.children = data.children.filter(function(a){return (a.size>size || a.size == -1);});
        for(var i = 0; i < data.children.length; i++){
            filter(data.children[i], size);
        }
    }

    filter(root, 10);
    var focus = root,
        nodes = pack.nodes(root);

    svg.append("g").selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("id", function(d){
            return "c" + d.index;
        })
        .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return density_color(d.color); })
        .on("click", function(d) { 
            selected(d);
            loadNodeData(d.index);
            // return zoom(focus == d ? root : d); 
        })
        .on("mouseover", function(d) {
            showCircleTooltip(this,d);
        })
        .on("mouseout", function(d){
            hideCircleTooltip();
        });

    // svg.append("g").selectAll("text")
    //     .data(nodes)
    //     .enter().append("text")
    //     .attr("class", "label")
    //     .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    //     .style("fill-opacity", function(d) { return d.parent === root ? 0 : 1; })
    //     .style("display", function(d) { return d.parent === root ? null : "none"; })
    //     .text(function(d) { return d.index; });

    // d3.select(window)
    //     .on("click", function() { zoom(root); });

    // function zoom(d, i) {
    //     var focus0 = focus;
    //     focus = d;

    //     var k = innerDiameter / d.r / 2;
    //     x.domain([d.x - d.r, d.x + d.r]);
    //     y.domain([d.y - d.r, d.y + d.r]);
    //     d3.event.stopPropagation();

    //     var transition = d3.selectAll(".node", ".node node--leaf", ".node node--root").transition()
    //         .duration(d3.event.altKey ? 7500 : 750)
    //         .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    //     transition.filter("circle")
    //         .attr("r", function(d) { return k * d.r; });

    // transition.filter("text")
    //     .filter(function(d) { return d.parent === focus || d.parent === focus0; })
    //     .style("fill-opacity", function(d) { return d.parent === focus ? 0 : 1; })
    //     .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
    //     .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    //}

    function selected(d){
        var selected = d;
        d3.selectAll(".node", ".node node--leaf").filter(function(d) {return ( (d.parent !== selected && d !== selected)); })
            .style("stroke-width", 0);
        d3.selectAll(".node", ".node node--leaf").filter(function(d) {return ( d === selected ); })
            .style("stroke", "white")
            .style("stroke-width", 4);
    };

    d3.select(self.frameElement).style("height", outerDiameter + "px");

    function showCircleTooltip(c, node){
        var density = node.density,
            size = node.size,
            index = node.index,
            k_value = node.k_value;

        // get scroll offset
        var xOffset = window.pageXOffset,
            yOffset = window.pageYOffset;

        var matrix = c.getScreenCTM();
        circle_tooltip.transition().duration(200).style("opacity", .9);

        var x = matrix.e + xOffset,
            y = matrix.f + yOffset;

        circle_tooltip.html("</p><p class='center-align'>Name: " + index +
                     "</p><p class='left-align'>Size:<span class='right-align'>" + size +
                     "</p><p class='left-align'>Density:<span class='right-align'>" + density +
                     "</p><p class='left-align'>K-value:<span class='right-align'>" + k_value)
            .style("left", x + "px")     
            .style("top", y + "px");
    };

    function hideCircleTooltip(){
        circle_tooltip.transition().duration(200).style("opacity", 0);
    };
    function highlight_searched(location){
        if (location.length == 0){
            alert("No Results");
            svg.selectAll(".node", ".node node--leaf")
                .style("stroke-width", 0)
                .style("stroke", "white");
        }else{
            for(var i = 0; i < location.length; i ++){
                svg.selectAll(".node", ".node node--leaf")
                    .style("stroke-width", 0)
                    .style("stroke", "white");
                svg.select("#c"+location[i])
                    .style("stroke", "yellow")
                    .style("stroke-width", 4);
            };
        };
    };

    function tipueKeyup(e){
        if (e.keyCode == 13) {
            function locations_loaded(){
                if(LOCATIONS_FOUND == false){
                    window.setTimeout(locations_loaded(),100);
                }else{
                    console.log(TIPUE_LOCATIONS);
                    highlight_searched(TIPUE_LOCATIONS);
                    LOCATIONS_FOUND = false;
                };
            };
            locations_loaded();
        };
    };

    $("#tipue_search_input").bind('keyup', tipueKeyup);

    $("#force_button").on("click", function(){
        $("#tipue_search_input").unbind('keyup', tipueKeyup);
    });
    $("#weighted_button").on("click", function(){
        $("#tipue_search_input").unbind('keyup', tipueKeyup);
    });
};
