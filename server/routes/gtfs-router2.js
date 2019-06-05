const express = require('express');
const router = express.Router();


const gtfs = require('../controllers/gtfs')


//routers
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
    const {agency_key} = req.params
    const query = {agency_key: agency_key}

    gtfs.getStops(query).then(stops => {
      res.json(stops)
    })

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

  router.get('/stop_times/:agency_key', async (req, res) => {
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
    //console.log(req.body)
    io.sockets.emit('gtfsrt', req.body);
    return res.status(200).json(req.body);

  })

  router.post('/passenger',  (req,res,next) => {
    console.log(req.body)
    io.sockets.emit('passenger', req.body);
    return res.status(200).json(req.body);

  })

  router.get('/stopwithroutes', async (req, res) => {
    const stops = gtfs.getRoutesById();
    res.json(stops);
  });
  // -------------------------------------------------------------
  //localhost:3000/api/v2/stoptimes/MRTA_Transit/00011
  router.get("/stoptimes/:agency_key/:route_id", (req, res, next) => {
    const {agency_key,route_id} = req.params
    const query = {agency_key: agency_key, route_id: route_id}
    gtfs.getStoptimes(query).then(stoptimes => {
      res.json(stoptimes)
    })
  })

  //localhost:3000/api/v2/stops/MRTA_Transit/00011
router.get("/stops/:agency_key/:route_id", (req, res, next) => {
  const {agency_key,route_id} = req.params
  const query = {agency_key: agency_key, route_id: route_id}
  gtfs.getStops(query).then(stops => {
    const stopwithroutes = []
    const stoplists= []
    stops.map(s => {
      stoplists.push(s)
    })

    obj = {
      route_id: route_id,
      num_stops: stops.length,
      stops: stoplists
    }

    stopwithroutes.push(obj)
    res.json(stopwithroutes)
  })
})

//localhost:3000/api/v2/stops/MRTA_Transit
router.get("/stops/:agency_key", async (req, res, next) => {
  const {agency_key} = req.params
  const query = {agency_key: agency_key}
  // list route in array
  const routelists = await gtfs.getRoutes(query).then(routes =>{
                      rl = routes.map(r => {
                        return r.route_id
                      })
                      return rl
                    });

  // get route + number_stops + stops
  const contruct = (route_id) => {
    return new Promise((res,rej) => {
      const query = {agency_key: agency_key, route_id: route_id}
      const object = gtfs.getStops(query).then(stops => {
        const stopwithroutes = []
        const stoplists= []
        stops.map(s => {
          stoplists.push(s)
        })

        obj = {
          route_id: route_id,
          num_stops: stops.length,
          stops: stoplists
        }
        return obj
      })
      res(object)
    })
  }

  const promises = routelists.map( async (ele) =>{
    const result = await contruct(ele)
    return new Promise((res, rej) => { res(result)})
  })

  Promise.all(promises)
    .then( results => {
      res.json(results)
    })
})

//localhost:3000/api/v2/routeinfos
router.get("/routeinfos", (req, res, next) => {

  const query = {}
  gtfs.getRouteInfo(query).then(routeinfos => {
    //console.log(routeinfos)
    res.json(routeinfos)
  })
})

  return router
};
