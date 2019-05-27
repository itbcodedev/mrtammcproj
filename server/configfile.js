const { loadGTFSDataFromFile } = require("./src/gtfs-helper");

function loadConfigfile(file) {
  const url = "./configfiles/" + file;
  return loadGTFSDataFromFile(url);
}

module.exports = loadConfigfile;
