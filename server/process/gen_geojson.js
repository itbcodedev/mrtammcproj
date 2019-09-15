const path = require('path')
var fs = require("fs");
const  KmlToShape = require('./kml_to_shape')


const kml = new KmlToShape
const FILE = path.join(__dirname, 'purple_gold.kml')
const OUTPUT = path.join(__dirname, 'shapes.txt')
const OUTPUTGEOJSON = path.join(__dirname, 'geojson.json')


const geojson  = kml.generate_geojson(FILE)


fs.writeFile(`${filename}.geojson`, JSON.stringify(geojson, null, 2), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});