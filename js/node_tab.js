function updateNodeTab(){
    // if there are existing charts delete them
    removeElement("tab_info");

    // create chart location
    var html = '<div class="row">' +
                    '<div class="card">' +
                        '<div class="cardInnerMargin">' +
                            '<div id="node_metadata">' +
                                '<h1 align="center">Click on a Node</h2>' +
                            '</div>'+
                        '</div>' +
                    '</div>' +
                '</div>';

    // append the charts to html
    addElement("node", "div", "container-fluid", "tab_info", html);
};

function loadNodeData(index){
    var path = "data/nodes/" + index + ".json"
    d3.json(path, function(error, data){
        if(error) throw error;
        
        var array_length = data[index].length;
        var html = ""
        for(var i = 0; i<array_length; i++){
            html += data[index][i] + '<br/>'
        };

        document.getElementById("node_metadata").innerHTML = html;

    });
};