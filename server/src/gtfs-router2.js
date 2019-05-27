const express = require('express');
const router = express.Router();

const http = require('http')
const io = require('socket.io')(http);
const gtfs = require('./lib/gtfs')

const Agency = require('../models/gtfs/agency')
const CalendarDate = require('../models/gtfs/calendar-date')
const Calendar = require('../models/gtfs/calendar')
const FareAttribute =  require('../models/gtfs/fare-atttribute')
const FareRule = require('../models/gtfs/fare-rule')
const FeedInfo = require('../models/gtfs/feed-info')
const Frequency = require('../models/gtfs/level')
const Level = require('../models/gtfs/level')
const Pathway = require('../models/gtfs/pathway')
const Route = require('../models/gtfs/route')
const Shape = require('../models/gtfs/shape')
const StopTime = require('../models/gtfs/stop-time')
const Stop = require('../models/gtfs/stop')
const Transfer = require('../models/gtfs/transfer')
const Trip = require('../models/gtfs/trip')



module.exports = function(io) {

  router.get('/agencies', async (req, res) => {
      gtfs.getAgencies((err, agencies) => {
        return res.json(agencies);
      });
  });

  router.get('/agencies/:agency_key', async (req, res) => {
    const { agency_key } = req.params;
    gtfs.getAgencie(agency_key, (err, agency) =>  {
      return res.json(agency);
    })
  });

  router.get('/stops', async (req, res) => {
    gtfs.getStops((err, stops) => {
      return res.json(stops);
    });

  });

  router.get('/routes', async (req, res) => {
    gtfs.getRoutes((err, routes) => {
      return res.json(routes);
    });
  });

  router.get('/trips', async (req, res) => {
    gtfs.getTrips((err, trips) => {
      return res.json(trips);
    });
  });

  router.get('/stop_times', async (req, res) => {
    gtfs.getStopTimes((err, stop_times) => {
      return res.json(stop_times);
    });

  });

  router.get('/calendars', async (req, res) => {
    gtfs.getCalendars((err, calendar) => {
      return res.json(calendar);
    });
  });

  router.get('/getroutebyagency/:agency_key', async (req, res) => {
    const { agency_key } = req.params;
    gtfs.getRoutesByAgency(agency_key, (err, routes) => {
      return res.json(routes);
    });
  });

  router.get('/getroutebyid/:agency_key/:route_id', async (req, res) => {
    const { agency_key,route_id } = req.params;
    gtfs.getRoutesById(agency_key, route_id,  (err, routes) => {
      return res.json(routes);
    });
  });

  router.post('/simulate',  (req,res,next) => {
    console.log(req.body)
    io.sockets.emit('gtfsrt', req.body);
    return res.status(200).json(req.body);

  })

  router.post('/passenger',  (req,res,next) => {
    console.log(req.body)
    io.sockets.emit('passenger', req.body);
    return res.status(200).json(req.body);

  })

  return router
};
