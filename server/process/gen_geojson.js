const path = require('path')
var fs = require("fs");
const  KmlToShape = require('./kml_to_shape')


const kml = new KmlToShape
const FILE = path.join(__dirname, 'purple_gold.kml')
const OUTPUT = path.join(__dirname, 'shapes.txt')
const OUTPUTGEOJSON = path.join(__dirname, 'geojson.json')


//const geojson  = kml.generate_geojsonLine(FILE)
const geojson  = kml.generate_geojson(FILE)
const shapes = kml.generate_shapesfile(FILE)
let filename = 'purple_gold.kml'.split(".")[0]

fs.writeFile(`${filename}.geojson`, JSON.stringify(geojson, null, 2), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});
