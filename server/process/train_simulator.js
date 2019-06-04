const moment = require('moment');
//const fetch = require('node-fetch');

const path = require('../path/path')

exports.TrainSimulator = class {

  constructor (gtfs, route_id,path_config) {
    this.gtfs = gtfs
    this.route_id = route_id
    this.path_config = path_config

    console.log(path.blue_chalearm_path_out.points.length)

  }

  getfileFromConfig(route_id,config) {
    const index = config.findIndex((path,index) => {
      return path.route_id === route_id
    })
    return index
  }


  async main() {
    const mmt = moment();
    const mmtMidnight = mmt.clone().startOf('day');
    const diffSeconds = mmt.diff(mmtMidnight, 'seconds');

    const fileindex = this.getfileFromConfig(this.route_id,this.path_config)
    this.file = this.path_config[fileindex].filepath;
    console.log('file', this.file)
    const routeinfo = await this.trainAdvance(diffSeconds)
    this.routeinfo = routeinfo
  }

  get trip_gtfs(){
    return this.routeinfo
  }
  // class method as async
  async  trainAdvance(now) {

    function getsecond(time) {
      const seconds = moment(time, 'HH:mm:ss: A').diff(moment().startOf('day'), 'seconds');
      return seconds
    }

    function checktime(trip, start_time, endtime_time) {
      const format = 'hh:mm:ss'
      const CurrentDate = moment();
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
      if ( index > -1) {
        return path.config[index].file
      }

    }

    function transformFormat(trips) {
      const trip_gtfs = trips.map(trip => {
        const time = trip.time_now
        const tripEntity = `${trip.route_name}-${trip.trip_id}`
        const tripId = trip.trip_id
        const latitude = trip.location.latitude
        const longitude = trip.location.longitude
        const gtfsrt = `
        {
          "header": {
            "gtfs_realtime_version": "2.0",
            "incrementality": "FULL_DATASET",
            "timestamp": "${time}"
          },
          "entity": {
            "id": "${tripEntity}",
            "vehicle": {
              trip: {
                trip_id: "${tripId}"
              },
              "position": {
                "latitude": "${latitude}",
                "longitude": "${longitude}"
              }
            }
          }
        }
        `
        return gtfsrt
      })
      return trip_gtfs
    }

    function addlocation(trips) {
      const trip_loc  = trips.map(trip => {
        const delta_t = trip.time_now_sec - trip.start_time_secs
        const runtime_secs = trip.runtime_secs
        const filemodule = getPathfile(trip)
        const loc_length = path[`${filemodule}`].points.length

        const loc_order = Math.round((delta_t/runtime_secs)*loc_length)
        const location = path[`${filemodule}`].points[loc_order]
        trip.file = filemodule
        trip.location = location
        return trip
      })

      return trip_loc
    }

    let routeinfos=[]
    try {
      const query = {}
      const routeinfos = await this.gtfs.getRouteInfo(query)
      const routeinfos_addsec = routeinfos.map(trip => {
          trip.start_time_secs = getsecond(trip.start_time)
          trip.end_time_secs = getsecond(trip.end_time)
          trip.runtime_secs = trip.end_time_secs - trip.start_time_secs
          return  trip
      })

      const routeinfos_now  = routeinfos_addsec.filter(trip => {
        return checktime(trip,trip.start_time,trip.end_time)
      })

      const routeinfos_loc = addlocation(routeinfos_now)

      console.log('routeinfos_now...', routeinfos_now.length)

      const trip_gtfs  = transformFormat(routeinfos_loc)
      return trip_gtfs
    } catch (err) {
      console.log(err)
      return 0
    }
  }

  getTrainPositionAt(time) {

  }



}
