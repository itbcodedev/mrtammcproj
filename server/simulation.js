const {TrainSimulator} = require('../server/process/train_simulator');
const train_config = require('../simulation/train_config')
const path_config = require('../simulation/path_config.json')
const gtfs = require('../server/controllers/gtfs')


const simulate = async () => {

  const train00011 = new TrainSimulator(gtfs,"00011",path_config)
  await train00011.main()
  console.log('train11.trip_gtfs.....', train00011.trip_gtfs.length)

  const train00012 = new TrainSimulator(gtfs,"00012",path_config)
  await train00012.main()
  console.log('train12.trip_gtfs.....', train00012.trip_gtfs.length)

  const train00013 = new TrainSimulator(gtfs,"00013",path_config)
  await train00013.main()
  console.log('train13.trip_gtfs.....', train00013.trip_gtfs.length)

  const train00014 = new TrainSimulator(gtfs,"00014",path_config)
  await train00014.main()
  console.log('train14.trip_gtfs.....', train00014.trip_gtfs.length)

}

module.exports = {simulate}
