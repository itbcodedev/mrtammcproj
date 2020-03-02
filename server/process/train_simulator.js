const moment = require('moment');
const _ = require('lodash');
//const fetch = require('node-fetch');

const path = require('../path/path')

exports.TrainSimulator = class {

  // pass controller gtfs query to db
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
    if ( this.routeinfo  == 0) {
      return [];
    }
     return this.routeinfo;
  }

  async trainAdvance(now) {

    function getsecond(time) {
      const seconds = moment(time, 'HH:mm:ss: A').diff(moment().startOf('day'), 'seconds');
      return seconds
    }

    // find active trip 
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

    // find path 
    function getPathfile(trip) {
      console.log("71.....", trip)
      console.log("71.........................")
      const index = path.config.findIndex(c => {
        console.log("73.......", c )
        console.log("73.........................")
        return (c.route_name == trip.route_name && c.direction == trip.direction && c.speed == trip.speed )
      })

      if (index > -1) {
        console.log("80",path.config[index].file )
        console.log("80............................")
        return path.config[index].file
      }

    }

    
    function transformFormat(stoptimes) {
      //each trip 
      const trip_gtfs = stoptimes.map(stoptime => {
        // console.log("85...", stoptime)
        // console.log("85......................")
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
        const start_point = stoptime.start_point
        const end_point = stoptime.end_point

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
                "end_time": "${end_time}",
                "start_point": "${start_point}",
                "end_point" : "${end_point}"
              },
              "position": {
                "latitude": "${latitude}",
                "longitude": "${longitude}"
              }
            }
          }
        }
        `
        console.log(gtfsrt)
        console.log("142...............................")
        return JSON.parse(gtfsrt)
      })
      return trip_gtfs
    }

    // step 3
    // pattern use async/await  in map
    // find location
    // calculate location from trip start time
    // 1 delta_ reference time from start
    //    |--------------|
    //  start_time      time_now
    // 2 loc_order = % of loc_lenght
    
    function addStoptime(gtfs,trips){

      return Promise.all(trips.map( async trip => {
        
        //console.log("159", trip.route_name, trip.trip_id, trip.start_time, trip.end_time)
        const delta_t = trip.time_now_sec - trip.start_time_secs 
        const runtime_secs = trip.runtime_secs
        const filemodule = getPathfile(trip)
        // console.log("174",  filemodule)
        const loc_length = path[`${filemodule}`].points.length
        const loc_order = Math.round((delta_t/ runtime_secs) * loc_length) 
        // use loc_order to estimate lat lng
        const location = path[`${filemodule}`].points[loc_order]
        // console.log("Line 167", trip.trip_id,runtime_secs,loc_order,loc_length)
        // Line 167 0513195 3507 78 2051
        trip.file = filemodule
        trip.location = location

        try {
          const query = {}
          query.trip_id = trip.trip_id
          // console.log("line 176", query)
          // use trip_id query stop_times
          const result = await gtfs.getRouteInfoWithTrip(query)
          // console.log("line 179",query, result[0])

          const format = 'hh:mm:ss'
          // start_time , end_time trip property
          const start_time = result[0].start_time
          const end_time = result[0].end_time
          // get stoptime 
          const stoptimes = result[0].stoptimes
          // trip + stoptime
          trip.stoptimes = stoptimes
    
          return trip
        } catch (err) {
          return err.toString()
        }
      }))
    } // end addstoptime

    let routeinfos = []
    try {
      const query = {}
      // step 1
      const routeinfos = await this.gtfs.getRouteInfo(query)
      // console.log("199",routeinfos)
      // const routeexclude = routeinfos.filter( trip => {
      //   return ! (trip.trip_id == "PT4" || trip.trip_id == "DEP-PL")
      // })
      // step 2 add sececond
      const routeinfos_addsec = routeinfos.map(trip => {
        trip.start_time_secs = getsecond(trip.start_time)
        trip.end_time_secs = getsecond(trip.end_time)
        trip.runtime_secs = trip.end_time_secs - trip.start_time_secs
        trip.runtime = Math.round(trip.runtime_secs/60)
        return trip
      })
      // step 3 find active train
      const routeinfos_now = routeinfos_addsec.filter(trip => {
        return checktime(trip, trip.start_time, trip.end_time)
      })
      //console.log("215",routeinfos_now)
      // contruct data
      const routeinfos_stoptimes = await addStoptime(this.gtfs, routeinfos_now)
      // console.log("218....", routeinfos_stoptimes)
      // console.log("218...................................")
      const trip_gtfs = transformFormat(routeinfos_stoptimes)
      console.log("222",trip_gtfs)
      console.log("222...................................")
      return trip_gtfs
    } catch (err) {
      // console.log(err)
      return 0
    }
  }
}