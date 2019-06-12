const moment = require('moment');
//const fetch = require('node-fetch');

const path = require('../path/path')

exports.TrainSimulator = class {

  constructor(gtfs, route_id, path_config) {
    this.gtfs = gtfs
    this.route_id = route_id
    this.path_config = path_config

  }

  getfileFromConfig(route_id, config) {
    // [
    //   {"route_id": "00011", "filepath": "purpleline_path-in.json"},
    //   {"route_id": "00012", "filepath": "purpleline_path-out.json"},
    //   {"route_id": "00013", "filepath": "blue_chalearm_path-in.json"},
    //   {"route_id": "00014", "filepath": "blue_chalearm_path-out.json"}
    // ]
    const index = config.findIndex((path, index) => {
      return path.route_id === route_id
    })
    return index
  }


  async main() {
    const mmt = moment();
    const mmtMidnight = mmt.clone().startOf('day');
    const diffSeconds = mmt.diff(mmtMidnight, 'seconds');
    //console.log('route_id',this.route_id)
    //console.log('path_config',this.path_config)
    const fileindex = this.getfileFromConfig(this.route_id, this.path_config)
    this.file = this.path_config[fileindex].filepath;
    //console.log('file', this.file)
    const routeinfo = await this.trainAdvance(diffSeconds)
    this.routeinfo = routeinfo
  }

  get trip_gtfs() {
    return this.routeinfo
  }


  // async addStoptime_test(trip_id) {
  //   // localhost:3000/api/v2/routeinfowithtrip/092021
  //   const query = {}
  //   query.trip_id = trip_id
  //   const tripresult = await this.gtfs.getRouteInfoWithTrip(query)
  //   console.log("-------------- addStoptime", trip_id)
  //   console.log("-------------- tripresult[0].trip_id",tripresult[0].trip_id)
  //   console.log("-------------- tripresult[0].trip_id",tripresult[0]._id)
  //
  // }
  // class method as async
  async trainAdvance(now) {

    function getsecond(time) {
      const seconds = moment(time, 'HH:mm:ss: A').diff(moment().startOf('day'), 'seconds');
      return seconds
    }

    function checktime(trip, start_time, endtime_time) {
      const format = 'hh:mm:ss'
      //const CurrentDate = moment().subtract('hours',2);
      //const CurrentDate = moment().subtract(5,'hours');
      const CurrentDate = moment()
      //console.log('CurrentDate........',  CurrentDate.format("HH:mm:ss"))
      let timenow = CurrentDate.format("HH:mm:ss")
      //let timenow = "10:10:10"
      trip.time_now = timenow
      trip.time_now_sec = getsecond(timenow)
      const time = moment(timenow, format)
      const at = moment(start_time, format)
      const dt = moment(endtime_time, format)

      if (time.isBetween(at, dt)) {
        return true
      } else {
        return false
      }
    }

    function getPathfile(trip) {
      const index = path.config.findIndex(c => {
        return (c.route_name == trip.route_name && c.direction == trip.direction)
      })

      if (index > -1) {
        //console.log('72 file.......', path.config[index].file)
        return path.config[index].file
      }

    }

    function transformFormat(trips) {
      const trip_gtfs = trips.map(trip => {

        const route_name = trip.route_name
        const time_now = trip.time_now
        const tripEntity = `${trip.route_name}-${trip.trip_id}`
        const headsign = `${trip.start_point} to ${trip.end_point}`
        const tripId = trip.trip_id
        const route_id = trip.route_id
        const latitude = trip.location.latitude
        const longitude = trip.location.longitude
        const start_time_secs = trip.start_time_secs
        const end_time_secs = trip.end_time_secs
        const time_now_sec = trip.time_now_sec
        const start_time = trip.start_time
        const end_time = trip.end_time
        const direction = trip.direction
        const runtime = trip.runtime

        const gtfsrt = `
        {
          "header": {
            "gtfs_realtime_version": "2.0",
            "incrementality": "FULL_DATASET",
            "timestamp": "${time_now}",
            "route_name": "${route_name}",
            "route_id": "${route_id}",
            "direction": "${direction}",
            "headsign": "${headsign}",
            "runtime": "${runtime}"
          },
          "entity": {
            "id": "${tripEntity}",
            "vehicle": {
              "trip": {
                "trip_id": "${tripId}",
                "start_time_secs": "${start_time_secs}",
                "end_time_secs": "${end_time_secs}",
                "time_now_sec": "${time_now_sec}",
                "start_time": "${start_time}",
                "end_time": "${end_time}"
              },
              "position": {
                "latitude": "${latitude}",
                "longitude": "${longitude}"
              }
            }
          }
        }
        `
        return JSON.parse(gtfsrt)
      })
      return trip_gtfs
    }
    //step2
    function addlocation(trips) {
      const trip_loc = trips.map(trip => {
        const delta_t = trip.time_now_sec - trip.start_time_secs
        const runtime_secs = trip.runtime_secs
        const filemodule = getPathfile(trip)
        // access json file
        const loc_length = path[`${filemodule}`].points.length
        // calculate latitude, longitude; latlng
        //
        const loc_order = Math.round((delta_t / runtime_secs) * loc_length)
        const location = path[`${filemodule}`].points[loc_order]
        trip.file = filemodule
        trip.location = location
        return trip
      })

      return trip_loc
    }


    function addposition(trips) {
      const trip_position = trips.map(trip => {
        const delta_t = trip.time_now_sec - trip.start_time_secs
        const runtime_secs = trip.runtime_secs
        const filemodule = getPathfile(trip)

        const loc_length = path[`${filemodule}`].points.length
        // calculate latitude, longitude; latlng
        //
        const loc_order = Math.round((delta_t / runtime_secs) * loc_length)
        const location = path[`${filemodule}`].points[loc_order]
        trip.file = filemodule
        trip.location = location
        return trip
      })

      return trip_position
    }

    // step 3
    // pattern use async/await  in map
    function addStoptime(gtfs,trips){
      return Promise.all(trips.map( async trip => {
        try {
          const query = {}
          query.trip_id = trip.trip_id
          //get data
          const result = await gtfs.getRouteInfoWithTrip(query)

          const format = 'hh:mm:ss'
          const start_time = result[0].start_time
          const end_time = result[0].end_time
          const stoptimes = result[0].stoptimes
          // console.log('start_time',start_time)
          // console.log('end_time',end_time)


          const select_stoptimes = stoptimes.filter( stoptime => {
            // console.log('stoptime.departure_time',stoptime.departure_time)
            // console.log('start_time',start_time)
            // console.log('end_time',end_time)

            const time = moment(stoptime.departure_time, format)
            const at = moment(start_time, format)
            const dt = moment(end_time, format)

            if (time.isBetween(at, dt)) {
              //console.log('true')
              return true
            } else {
              //console.log('false')
              return false
            }

          })

          //console.log('204.......',typeof select_stoptimes)
          //console.log('204.......',select_stoptimes)
          trip.stoptimes = select_stoptimes


          return trip
        } catch (err) {
          return err.toString()
        }
      }))
    } //end addstoptime


    let routeinfos = []

    try {
      const query = {}

      // step 1
      const routeinfos = await this.gtfs.getRouteInfo(query)
      const routeinfos_addsec = routeinfos.map(trip => {
        trip.start_time_secs = getsecond(trip.start_time)
        trip.end_time_secs = getsecond(trip.end_time)
        trip.runtime_secs = trip.end_time_secs - trip.start_time_secs
        trip.runtime = Math.round(trip.runtime_secs/60)
        return trip
      })
      const routeinfos_now = routeinfos_addsec.filter(trip => {
        return checktime(trip, trip.start_time, trip.end_time)
      })
      // step 2
      const routeinfos_loc = addlocation(routeinfos_now)

      // step 3
      const routeinfos_stoptime = await addStoptime(this.gtfs,routeinfos_loc)
      //console.log('237....',routeinfos_stoptime)


      const trip_gtfs = transformFormat(routeinfos_stoptime)
      //console.log("241...",trip_gtfs)

      return trip_gtfs
    } catch (err) {
      //console.log(err)
      return 0
    }
  }




}

// ]   {
// [0]     agency_key: 'MRTA_Transit',
// [0]     route_name: 'blue',
// [0]     trip_id: '082946',
// [0]     start_point: 'HUA',
// [0]     start_time: '22:33:15',
// [0]     end_point: 'TAO',
// [0]     end_time: '23:07:31',
// [0]     length: '21028',
// [0]     runtime: '',
// [0]     direction: '1',
// [0]     __v: 0,
// [0]     start_time_secs: 81195,
// [0]     end_time_secs: 83251,
// [0]     runtime_secs: 2056,
// [0]     time_now: '22:33:50',
// [0]     time_now_sec: 81230,
// [0]     file: 'blue_chalearm_path_out',
// [0]     location: {
// [0]       index: 36,
// [0]       latitude: '13.7363351676309',
// [0]       longitude: '100.52005564644'
// [0]     }
// [0]   }
