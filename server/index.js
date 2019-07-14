// config data
const PORT = process.env.PORT || 3000;
const NODE_ENV =  process.env.NODE_ENV;

console.log('NODE_ENV......', NODE_ENV)

const BASE_API_ENDPOINT = '/api/v1';
const BASE_API_ENDPOINT2 = '/api/v2';
const proxy = require('http-proxy-middleware');
const path = require('path');
const bodyParser = require('body-parser');

const express = require('express');
const cors = require('cors');
const database = require('./database');

const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// router
const gtfsRouter = require('./routes/gtfs.router');
const gtfsRouter2 = require('./routes/gtfs-router2')(io);

const userRouter = require('./routes/user.router');
const parkRouter = require('./routes/parking.router');
const fareRouter = require('./routes/fare.router');
const calTripRouter = require('./routes/caltrip.router');
const alertRouter = require('./routes/alert.router');
const passengerRouter = require('./routes/passenger.router')(io);
const fileRoute = require('./routes/file.router');
const configfile = require('./routes/configfile.router');
const listdir = require('./routes/listdir.router');
const ldap = require('./routes/ldap.router');
const kmlRouter = require('./routes/kml.router');
const gtfsdbRouter = require('./routes/gtfsdb.router');

database.init();



io.on('connection', (socket) => {
  console.log('User connect')
  socket.emit('message', 'here is simulate data aaa')
});


// var originsWhitelist = [
//   'http://localhost:4200',      //this is my front-end url for development
//   'http://localhost:3000',
//    'http://mmc_app1.mrta.co.th',
//    'http://122.155.204.80/mrta/api/mrta/mrta/Pushnotification'
// ];
//
// var corsOptions = {
//   origin: function(origin, callback){
//         var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
//         callback(null, isWhitelisted);
//   },
//   credentials:true
// }

// manage middle ware
app.use(
  '/mrta',
  proxy({ target: 'http://122.155.204.80', changeOrigin: true })
);

// app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(BASE_API_ENDPOINT, gtfsRouter);
app.use(BASE_API_ENDPOINT2, gtfsRouter2);
app.use('/users', userRouter);
app.use('/parking', parkRouter);
app.use('/fare', fareRouter);
app.use('/api/v2/alerts', alertRouter);
app.use('/api/v2/passengers', passengerRouter);
app.use('/upload', fileRoute);
app.use('/configfile', configfile);
app.use('/listdir', listdir);
app.use('/ldap',ldap);
app.use('/kml',kmlRouter);
app.use('/gtfsdb',gtfsdbRouter);


if (process.env.NODE_ENV === 'production') {
  console.log("process.env.NODE_ENV :" + process.env.NODE_ENV)
  express.static.mime.define({'application/octet-stream': ['csv']})
  express.static.mime.define({'application/xhtml+xml': ['xml']})
  express.static.mime.define({'application/xml': ['xml']})
  express.static.mime.define({'application/vnd.google-earth.kml+xml': ['kml']})
  express.static.mime.define({'application/vnd.google-earth.kmz': ['kmz']})
  app.use(express.static(path.join(__dirname,'../mrtammc/dist/mrtammc')));
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../mrtammc/dist/mrtammc/index.html'));
  });
}

//1 Import the mongoose module
const mongoose = require('mongoose');

//2 Set up default mongoose connection
//mongoose.connect('mongodb://localhost/mmcmrtadb',{ useNewUrlParser: true });
mongoose.connect('mongodb://localhost/mongoose_basics',{ useNewUrlParser: true });
//3 Get the default connection
var db = mongoose.connection;

//4 Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const {simulate} = require('./simulation')
//simulate()
setInterval(simulate, 2000);

server.listen(PORT, () => {
  console.log(`Server start port ${PORT}`)
})
