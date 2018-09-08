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
    //var path = "data/nodes/" + index + ".json"
    var path = "data/sample.json";
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
            title = '<div class="c">Sample</div>',
            devices = '<div class="c">Vertices</div><hr/>',
            t_edges = '<div class="c">Same Device</div><hr/>',
            f_edges = '<div class="c">Different Device</div><hr/>';

        removeElement("tab_info");
        addElement("node", "div", "container-fluid", "tab_info", html);

        for(var i = 0; i < data["devices"].length; i++){
            devices += data["devices"][i] + "<br/>";
        };
        for(var i = 0; i < data["t-edges"].length; i++){
            var key = Object.keys(data["t-edges"][i])[0];
            var val = data["t-edges"][i][key];
            t_edges += key + "\t" + val + "<br/>";
        };
        for(var i = 0; i < data["f-edges"].length; i++){
            var key = Object.keys(data["f-edges"][i])[0];
            var val = data["f-edges"][i][key];
            f_edges += key + "\t" + val + "<br/>";
        };

        document.getElementById("node_title").innerHTML = title;
        document.getElementById("device_list").innerHTML = devices;
        document.getElementById("t_edges").innerHTML = t_edges;
        document.getElementById("f_edges").innerHTML = f_edges;
    });
};