// read in distribution data and create chart
var SIZEFILE = "data/SizeDistribution.tsv",
    DENSFILE = "data/DensityDistribution.tsv",
    HEATFILE = "data/DistributionV2.tsv",
    INTERFILE = "data/IntersectionDistributionV2.tsv";

var CIRCINFO = null;

// create charts for home tag
function updateHomeTab(){

    // if there are existing charts delete them
    removeElement("tab_info");

    var html = '';
    if (CIRCINFO == true){
        html = 
                '<div class="row">' +
                    '<div class="card">' +
                        '<div class="cardInnerMargin">' +
                            '<div id="dens_legend"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="card">' +
                        '<div class="cardInnerMargin">' +
                            '<div id="size_distributions"></div>'+
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="card">' +
                        '<div class="cardInnerMargin">' +
                            '<div id="dens_distributions"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="card">' +
                        '<div class="cardInnerMargin">' +
                            '<div id="heat_map"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        // append the charts to html
        addElement("home", "div", "container-fluid", "tab_info", html);

        create_legend("#dens_legend");

        // create the charts
        loadSize();
        loadDens();
        loadHeat();
    }else if(CIRCINFO == false){
        html = 
                '<div class="row">' +
                    '<div class="card">' +
                        '<div class="cardInnerMargin">' +
                            '<div id="inter_distributions"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        // append the charts to html
        addElement("home", "div", "container-fluid", "tab_info", html);
        loadInter();
    }
}

// size distribution
function loadSize() {
    d3.tsv(SIZEFILE, function(d){
        return {
            size : +d.Size,
            value : +d.value
        };
    }, function(error, data){
        if(error) throw error;

        var ylabel = "Number of Nodes",
            xlabel = "Devices",
            title  = "Number of Nodes with &#8804 X Devices",
            target = "#size_distributions";

        var largest = d3.max(data, function(d){return d.value;}).toString(),
            zeros   = Math.pow(10,(largest.length - 2))

        if(largest.length > 4){
            data.forEach(function(d){
                d.value = +d.value/zeros
            });

            var zeros = zeros.toString();
            zeros  = zeros.slice(0, zeros.length - 3) + "," + zeros.slice(-3);
            ylabel = ylabel + " in " + zeros.toString();
        };

        createLineChart(data, target, title, ylabel, xlabel);
    });
};

//density distribution
function loadDens(){
    d3.tsv(DENSFILE, function(d){
        return {
            size : +d.density,
            value : +d.value
        };
    }, function(error, data){
        if(error) throw error;

        var ylabel = "Number of Nodes",
            xlabel = "Density",
            title  = "Number of Nodes with Density &#8804 X",
            target = "#dens_distributions";

        var largest = d3.max(data, function(d){return d.value;}).toString(),
            zeros   = Math.pow(10,(largest.length - 2))

        if(largest.length > 4){
            data.forEach(function(d){
                d.value = +d.value/zeros
            });

            var zeros = zeros.toString();
            zeros  = zeros.slice(0, zeros.length - 3) + "," + zeros.slice(-3);
            ylabel = ylabel + " in " + zeros.toString();
        };

        createLineChart(data, target, title, ylabel, xlabel);
    });
};

function loadHeat(){
    d3.tsv(HEATFILE, function(d){
        return {
            size: +d.Size,
            density: +d.Density,
            value: +d.Value
        };
    }, function(error, data){
        if(error) throw error;

        var ylabel = "Density",
            xlabel = "Devices",
            title  = "Node Size and Density",
            target = "#heat_map";

        createHeatMap(data, target, title, ylabel, xlabel);
    });
};

function loadInter(){
    d3.tsv(INTERFILE, function(d){
        return {
            size: +d.Size,
            value: +d.value
        };
    }, function(error, data){
        if(error) throw error;

        var ylabel = "Devices",
            xlabel = "Intersection Size",
            title  = "Intersection Distribution",
            target = "#inter_distributions";

        createBarChart(data, target, title, ylabel, xlabel);
    });
}