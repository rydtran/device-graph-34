var CHART_COUNT = 0;

function updateMiscTab(){
    // if there are existing charts delete them
    removeElement("tab_info");
    target = document.getElementById("misc_info");
    if(target == null){
        // create chart location
        var html =  '<div class="container-fluid" id="chart_area">' +
                        '<div class="row">' +
                            '<div class="card">' +
                                '<div class="cardInnerMargin">' +
                                    '<div class="input-group">' +
                                        // '<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="#">Select a File<span class="caret"></span></a>' +
                                        // '<ul class="dropdown-menu">' +
                                        // '<li><a href="#">Histogram</a></li>' +
                                        // '<li><a href="#">Line Chart</a></li>' +
                                        // '<li><a href="#">Bar Chart</a></li>' +
                                        // '<li><a href="#">Heatmap</a></li>' +
                                        // '</ul>' +
                                        '<span class="input-group-addon"><i class="glyphicon glyphicon-option-vertical"></i></span>'+
                                        '<select class="form-control" id="select_options">' +
                                            '<option>Histogram</option>'+
                                            '<option>Line Chart</option>'+
                                            '<option>Bar Graph</option>'+
                                            '<option>Heatmap</option>'+
                                        '</select>'+
                                    '</div>' +
                                    '<div class="input-group">' +
                                        '<span class="input-group-addon"><i class="glyphicon glyphicon-file"></i></span>'+
                                        '<input type="text" class="form-control" id="file_name" placeholder="File Name">'+
                                    '</div>' +
                                    '<button type="button" class="btn btn-default btn-block" onclick="createChart()">Create Chart</button>'+
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

        // append the charts to html
        addElement("misc", "div", "container-fluid", "misc_info", html);
    };
};

function loadHistogramData(file_name){
    d3.tsv("data/chart_data/" + file_name, function(d){
        return {
            value : +d.value
        };
    },function(error, data){
        if(error) throw error;
        var chart_id = "h" + CHART_COUNT;
        var container_id = "ch" + CHART_COUNT;

        var html =  '<div class="card">' +
                        '<div class="cardInnerMargin">' +
                            '<button id='+'"close'+CHART_COUNT+'" type="button" class="close" style="position:absolute;"><span aria-hidden="true">&times;</span></button>'+
                            '<div id='+chart_id+'></div>' +
                        '</div>' +
                    '</div>';
        addElement("chart_area", "div", "row", container_id, html)

        createHistogram(data, "#" + chart_id);

        $("#close"+CHART_COUNT).on("click", function(){
            removeElement(container_id);
        });

        CHART_COUNT += 1;
    });
};

function createChart(){
    var option = document.getElementById("select_options").value;
    //var file_name = document.getElementById("file_name").value;
    var file_name = "test1.tsv";

    if(file_name == ""){
        alert("Please type a file name.");
        return
    };

    if(option == "Histogram"){
        loadHistogramData(file_name);
    }
    else if(option == "Line Chart"){
        createHistogram();
    }
    else if(option == "Bar Graph"){
        createHistogram();
    }
    else if(option == "Heatmap"){
        createHistogram();
    };
};