const _ = require('lodash');

const Agency = require('../../models/gtfs/agency')
const CalendarDate = require('../../models/gtfs/calendar-date')
const Calendar = require('../../models/gtfs/calendar')
const FareAttribute =  require('../../models/gtfs/fare-atttribute')
const FareRule = require('../../models/gtfs/fare-rule')
const FeedInfo = require('../../models/gtfs/feed-info')
const Frequency = require('../../models/gtfs/level')
const Level = require('../../models/gtfs/level')
const Pathway = require('../../models/gtfs/pathway')
const Route = require('../../models/gtfs/route')
const Shape = require('../../models/gtfs/shape')
const StopTime = require('../../models/gtfs/stop-time')
const Stop = require('../../models/gtfs/stop')
const Transfer = require('../../models/gtfs/transfer')
const Trip = require('../../models/gtfs/trip')


module.exports = {
  getAgencies: (cb) =>{
    Agency.find({}).exec(cb)

  },

  getAgencie: ( agency_key,cb ) => {
    Agency.findOne({
      agency_key: agency_key
    }).exec(cb)
  },

  getStops: (cb) => {
    Stop.find({}).exec(cb)
  },

  getRoutes: (cb) => {
    Route.find({}).exec(cb)
  },
  getTrips: (cb) => {
    Trip.find({}).exec(cb)
  },
  getStopTimes: (cb) => {
    StopTime.find({}).exec(cb)
  },

  getCalendars: (cb) => {
    Calendar.find({}).exec(cb)
  },
  /*
   * Returns an array of routes for the `agency_key` specified
   */
  getRoutesByAgency: (agency_key,cb) => {
    Route.find({
      agency_key: agency_key
    }).exec(cb)
  },

/*
 * Returns a route for the `route_id` specified
 */
  getRoutesById: (agency_key, route_id, cb) => {
    Route.findOne({
      agency_key: agency_key,
      route_id: route_id
    }).exec(cb);
  },
}
