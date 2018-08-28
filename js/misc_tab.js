function updateMiscTab(){
    // if there are existing charts delete them
    removeElement("tab_info");

    // create chart location
    var html = '<div class="row">' +
                    '<div class="card">' +
                        '<div class="cardInnerMargin">' +
                            '<div id="create_charts">' +
                            	'<button type="button" class="btn btn-default" onclick="createHistogramChart">Create</button>' +
                            '</div>'+
                        '</div>' +
                    '</div>' +
                '</div>';

    // append the charts to html
    addElement("misc", "div", "container-fluid", "tab_info", html);
};

function createHistogramChart(){
};