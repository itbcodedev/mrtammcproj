const moment = require('moment');
const _ = require('lodash');
//const fetch = require('node-fetch');

const path = require('../path/path')

exports.TrainSimulator = class {

  constructor(gtfs) {
    this.gtfs = gtfs
  }

  getfileFromConfig(route_id, config) {

    const index = config.findIndex((path, index) => {
      return path.route_id === route_id
    })
    //console.log('index of ',route_id,index)
    return index
  }


  async main() {
    const mmt = moment();
    const mmtMidnight = mmt.clone().startOf('day');
    const diffSeconds = mmt.diff(mmtMidnight, 'seconds');

    const routeinfo = await this.trainAdvance(diffSeconds)
    this.routeinfo = routeinfo
  }

  get trip_gtfs() {
    return this.routeinfo
  }

  async trainAdvance(now) {

    function getsecond(time) {
      const seconds = moment(time, 'HH:mm:ss: A').diff(moment().startOf('day'), 'seconds');
      return seconds
    }

    function checktime(trip, start_time, endtime_time) {
      const format = 'hh:mm:ss'

      //const CurrentDate = moment().subtract(3,'hours');
      const CurrentDate = moment()

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

    
    function transformFormat(stoptimes) {
      //each trip 
      const trip_gtfs = stoptimes.map(stoptime => {

        //console.log(stoptime)
        

        const route_name = stoptime.route_name
        const time_now = stoptime.time_now
        const tripEntity = `${stoptime.route_name}-${stoptime.trip_id}`
        const headsign = `${stoptime.start_point} to ${stoptime.end_point}`
        const tripId = stoptime.trip_id
        const route_id = stoptime.route_id

        const latitude = stoptime.location.latitude
        const longitude = stoptime.location.longitude

        const start_time_secs = stoptime.start_time_secs
        const end_time_secs = stoptime.end_time_secs
        const time_now_sec = stoptime.time_now_sec
        const start_time = stoptime.start_time
        const end_time = stoptime.end_time
        const direction = stoptime.direction
        const runtime = stoptime.runtime

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

    // step 3
    // pattern use async/await  in map
    function addStoptime(gtfs,trips){

      return Promise.all(trips.map( async trip => {
        // calculate location from trip start time
        const delta_t = trip.time_now_sec - trip.start_time_secs 
        const runtime_secs = trip.runtime_secs
        const filemodule = getPathfile(trip)
        const loc_length = path[`${filemodule}`].points.length
        const loc_order = Math.round((delta_t/ runtime_secs) * loc_length) 
        
        const location = path[`${filemodule}`].points[loc_order]
        //console.log(trip.trip_id,runtime_secs,loc_order,loc_length)
        trip.file = filemodule
        trip.location = location
        

        try {
          const query = {}
          query.trip_id = trip.trip_id
          //get data
          const result = await gtfs.getRouteInfoWithTrip(query)
          //console.log(result[0])
          const format = 'hh:mm:ss'
          // start_time , end_time trip property
          const start_time = result[0].start_time
          const end_time = result[0].end_time
          //get stoptime 
          const stoptimes = result[0].stoptimes

          
          trip.stoptimes = stoptimes
    
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
      // const routeexclude = routeinfos.filter( trip => {
      //   return ! (trip.trip_id == "PT4" || trip.trip_id == "DEP-PL")
      // })
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

      const routeinfos_stoptimes = await addStoptime(this.gtfs,routeinfos_now)
     
      const trip_gtfs = transformFormat(routeinfos_stoptimes)
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


          //console.log(trip.trip_id, stoptimes.length)
          // const select_stoptimes = stoptimes.filter( stoptime => {
          //   const time = moment(stoptime.departure_time, format)
          //   const at = moment(start_time, format)
          //   const dt = moment(end_time, format)

          //   if (time.isBetween(at, dt)) {
          //     //console.log('true')
          //     return true
          //   } else {
          //     //console.log('false')
          //     return false
          //   }

          // })
          // calulate location
          // moment(time, 'HH:mm:ss: A').diff(moment().startOf('day'), 'seconds');


          // {
          //   [0]   agency_key: 'MRTA_Transit',
          //   [0]   route_name: 'blue',
          //   [0]   route_id: '00014',
          //   [0]   trip_id: '080746',
          //   [0]   start_point: 'HUA',
          //   [0]   start_time: '09:15:45',
          //   [0]   end_point: 'TAO',
          //   [0]   end_time: '09:50:01',
          //   [0]   length: '21028',
          //   [0]   runtime: 34,
          //   [0]   direction: '1',
          //   [0]   __v: 0,
          //   [0]   start_time_secs: 33345,
          //   [0]   end_time_secs: 35401,
          //   [0]   runtime_secs: 2056,
          //   [0]   time_now: '09:15:51',
          //   [0]   time_now_sec: 33351,
          //   [0]   file: 'blue_chalearm_path_out',
          //   [0]   location: {
          //   [0]     index: 6,
          //   [0]     latitude: '13.737285666636',
          //   [0]     longitude: '100.517780102064'
          //   [0]   },
          //   [0]   stoptimes: [
          //   [0]     {
          //   [0]       _id: 5d2a8f3f1473da58b879eb88,
          //   [0]       agency_key: 'MRTA_Transit',
          //   [0]       trip_id: '080746',
          //   [0]       arrival_time: '09:15:45',
          //   [0]       departure_time: '09:15:45',
          //   [0]       stop_id: 'BL28',
          //   [0]       stop_sequence: 1,
          //   [0]       __v: 0
          //   [0]     },
          //   [0]     {
          //   [0]       _id: 5d2a8f3f1473da58b879eb89,
          //   [0]       agency_key: 'MRTA_Transit',
          //   [0]       trip_id: '080746',
          //   [0]       arrival_time: '09:18:11',
          //   [0]       departure_time: '09:18:11',
          //   [0]       stop_id: 'BL27',
          //   [0]       stop_sequence: 2,
          //   [0]       __v: 0
          //   [0]     },
          //   [0]     {
          //   [0]       _id: 5d2a8f3f1473da58b879eb8a,
          //   [0]       agency_key: 'MRTA_Transit',
          //   [0]       trip_id: '080746',
          //   [0]       arrival_time: '09:19:43',
          //   [0]       departure_time: '09:19:43',
          //   [0]       stop_id: 'BL26',
          //   [0]       stop_sequence: 3,
          //   [0]       __v: 0
          //   [0]     },
          //   [0]     {
          //   [0]       _id: 5d2a8f3f1473da58b879eb8b,
          //   [0]       agency_key: 'MRTA_Transit',
          //   [0]       trip_id: '080746',
          //   [0]       arrival_time: '09:21:23',
          //   [0]       departure_time: '09:21:23',
          //   [0]       stop_id: 'BL25',
          //   [0]       stop_sequence: 4,
          //   [0]       __v: 0
          //   [0]     },
          //   [0]     {
          //   [0]       _id: 5d2a8f3f1473da58b879eb8c,
          //   [0]       agency_key: 'MRTA_Transit',
          //   [0]       trip_id: '080746',
          //   [0]       arrival_time: '09:23:03',
          //   [0]       departure_time: '09:23:03',
          //   [0]       stop_id: 'BL24',
          //   [0]       stop_sequence: 5,
          //   [0]       __v: 0
          //   [0]     },
          //   [0]     {
          //   [0]       _id: 5d2a8f3f1473da58b879eb8d,
          //   [0]       agency_key: 'MRTA_Transit',
          //   [0]       trip_id: '080746',
          //   [0]       arrival_time: '09:24:46',
          //   [0]       departure_time: '09:24:46',
          //   [0]       stop_id: 'BL23',
          //   [0]       stop_sequence: 6,
          //   [0]       __v: 0
          //   [0]     },