var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    route_th : {type: String, require:true},
    route_en : {type: String, require:true},
    color: {type: String, require:true},
    kml_file: {type: String, require:true},
    geojsonline_file: {type: String, require:true},
    geojsonpoint_file: {type: String, require:true}
});

module.exports = mongoose.model('Kmltoroute',schema);