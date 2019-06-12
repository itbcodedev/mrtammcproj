const {TrainSimulator} = require('../server/process/train_simulator');
const train_config = require('../simulation/train_config')
const path_config = require('../simulation/path_config.json')
const gtfs = require('../server/controllers/gtfs')
const request = require('request');
const simulate = async (io) => {

  //const simulate_url = "http://mmc_app1.mrta.co.th/api/v2/simulate"
  //gtfs-route2.js
  const simulate_url = "http://localhost:3000/api/v2/simulate"
  console.log('Simulate URL endpoint .....', simulate_url)

  const train00011 = new TrainSimulator(gtfs,"00011",path_config)

  await train00011.main()
  console.log(train00011.trip_gtfs)
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



  // const train00012 = new TrainSimulator(gtfs,"00012",path_config)
  // await train00012.main()
  //
  //
  // train00012.trip_gtfs.map(trip => {
  //   request({
  //       url: simulate_url,
  //       method: "POST",
  //       json: true,
  //       body: trip
  //   }, function (error, response, body){
  //       //console.log(response);
  //   });
  // })



  // const train00013 = new TrainSimulator(gtfs,"00013",path_config)
  // await train00013.main()
  //
  // train00013.trip_gtfs.map(trip => {
  //   request({
  //       url: simulate_url,
  //       method: "POST",
  //       json: true,
  //       body: trip
  //   }, function (error, response, body){
  //       //console.log(response);
  //   });
  // })



  // const train00014 = new TrainSimulator(gtfs,"00014",path_config)
  // await train00014.main()
  // train00014.trip_gtfs.map(trip => {
  //   request({
  //       url: simulate_url,
  //       method: "POST",
  //       json: true,
  //       body: trip
  //   }, function (error, response, body){
  //       //console.log(response);
  //   });
  // })


}

module.exports.simulate = simulate
