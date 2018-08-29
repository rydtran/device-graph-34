function updateMiscTab(){
    // if there are existing charts delete them
    removeElement("tab_info");
    $.get("/charts", function(data){
        console.log(data.value);
    });

    // create chart location
    var html = '<div class="row">' +
                    '<div class="card">' +
                        '<div class="cardInnerMargin">' +
                            '<div id="create_charts">' +
                                '<div class="row">' +
                                    '<div class="col">' +
                                        '<div class="input-group">' +
                                            // '<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="#">Select a File<span class="caret"></span></a>' +
                                            // '<ul class="dropdown-menu">' +
                                            // '<li><a href="#">Histogram</a></li>' +
                                            // '<li><a href="#">Line Chart</a></li>' +
                                            // '<li><a href="#">Bar Chart</a></li>' +
                                            // '<li><a href="#">Heatmap</a></li>' +
                                            // '</ul>' +
                                            '<select class="form-control" id="sel1">' +
                                                '<option>Histogram</option>'+
                                                '<option>Line Chart</option>'+
                                                '<option>Bar Graph</option>'+
                                                '<option>Heatmap</option>'+
                                            '</select>'+
                                            '<input type="text" class="form-control" placeholder="File Name"/>'+
                                        '</div>' +
                                    '/<div>' +
                                '</div>' +
                            '</div>'+
                        '</div>' +
                    '</div>' +
                '</div>';

    // append the charts to html
    addElement("misc", "div", "container-fluid", "tab_info", html);
};

function createHistogramChart(){
};