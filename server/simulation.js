const {TrainSimulator} = require('../server/process/train_simulator');
const train_config = require('../simulation/train_config')
const path_config = require('../simulation/path_config.json')
const gtfs = require('../server/controllers/gtfs')
const request = require('request');
const simulate = async (io) => {

  const train00011 = new TrainSimulator(gtfs,"00011",path_config)
  await train00011.main()



  const simulate_url = "http://mmc_app1.mrta.co.th/api/v2/simulate"
  //const simulate_url = "http://localhost:3000/api/v2/simulate"


  console.log('Simulate URL endpoint .....', simulate_url)

  train00011.trip_gtfs.map(trip => {
    request({
        url: simulate_url,
        method: "POST",
        json: true,
        body: trip
    }, function (error, response, body){
        //console.log(response);
    });
  })

  //console.log('train11.trip_gtfs.....', train00011.trip_gtfs.length)

  const train00012 = new TrainSimulator(gtfs,"00012",path_config)
  await train00012.main()


  train00012.trip_gtfs.map(trip => {
    request({
        url: simulate_url,
        method: "POST",
        json: true,
        body: trip
    }, function (error, response, body){
        //console.log(response);
    });
  })

  //io.sockets.emit('gtfsrt', train00012.trip_gtfs);
  //console.log('train12.trip_gtfs.....', train00012.trip_gtfs.length)

  const train00013 = new TrainSimulator(gtfs,"00013",path_config)
  await train00013.main()

  train00013.trip_gtfs.map(trip => {
    request({
        url: simulate_url,
        method: "POST",
        json: true,
        body: trip
    }, function (error, response, body){
        //console.log(response);
    });
  })

  //io.sockets.emit('gtfsrt', train00013.trip_gtfs);
  //console.log('train13.trip_gtfs.....', train00013.trip_gtfs.length)

  const train00014 = new TrainSimulator(gtfs,"00014",path_config)
  await train00014.main()
  train00014.trip_gtfs.map(trip => {
    request({
        url: simulate_url,
        method: "POST",
        json: true,
        body: trip
    }, function (error, response, body){
        //console.log(response);
    });
  })

  //io.sockets.emit('gtfsrt', train00014.trip_gtfs);
  //console.log('train14.trip_gtfs.....', train00014.trip_gtfs.length)

}

module.exports.simulate = simulate
