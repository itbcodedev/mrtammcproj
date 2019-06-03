const train_config = require('./train_config')
const path_config = require('./path_config.json')
const gtfs = require('../server/controllers/gtfs')

if (train_config.simulation) {
  const {TrainSimulator} = require('../server/process/train_simulator');
  //
  const train = new TrainSimulator(gtfs,"00014",path_config)
  train.train
}
