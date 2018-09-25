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
    //var path = "data/sample.json";
    $('[href="#node"]').tab('show');
    d3.json(path, function(error, data){
        if(error) throw error;
    
        var html =  '<div class="row">' +
                        '<div class="card">' +
                            '<div class="cardInnerMargin">' +
                                '<div id="node_title"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="card">' +
                            '<div class="cardInnerMargin">' +
                                '<div id="device_list"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="card">' +
                            '<div class="cardInnerMargin">' +
                                '<div id="t_edges"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="card">' +
                            '<div class="cardInnerMargin">' +
                                '<div id="f_edges"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>',
            title = '<div class="c">'+index+'</div>',
            devices = '<div class="c">Vertices</div><hr/>',
            t_edges = '<div class="c">Same Device</div><hr/>',
            f_edges = '<div class="c">Different Device</div><hr/>';

        removeElement("tab_info");
        addElement("node", "div", "container-fluid", "tab_info", html);

        for(var i = 0; i < data[index].length; i++){
            devices += data[index][i] + "<br/>";
        };
        for(var i = 0; i < data["1"].length; i++){
            var key = data["1"][i][0],
                val = data["1"][i][1];
            t_edges += key + "    " + val + "<br/>";
        };
        for(var i = 0; i < data["0 and -1"].length; i++){
            var key = data["0 and -1"][i][0],
                val = data["0 and -1"][i][1];
            f_edges += key + "    " + val + "<br/>";
        };
        console.log(data["0 and -1"])

        document.getElementById("node_title").innerHTML = title;
        document.getElementById("device_list").innerHTML = devices;
        document.getElementById("t_edges").innerHTML = t_edges;
        document.getElementById("f_edges").innerHTML = f_edges;
    });
};