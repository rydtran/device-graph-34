var circle_path = "graphCircle.json"
var force_path = "graphForce.json"
var CIRCLE_DATA,
    FORCE_DATA;

html = '<p>Loading Data</p>'
addElement("vis_area","div","row","loading_text",html);
d3.queue()
    .defer(d3.json, circle_path)
    .defer(d3.json, force_path)
    .await(function(error, data1, data2){
        if(error) throw error;
        CIRCLE_DATA = data1;
        FORCE_DATA = data2
        removeElement("loading_text")
    });