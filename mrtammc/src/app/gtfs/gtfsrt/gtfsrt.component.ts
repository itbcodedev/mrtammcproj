import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GtfsrtwsService } from '../../services/gtfsrtws.service'
import { GtfsService } from '../../services/gtfs2.service';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';

declare let L;

@Component({
  selector: 'app-gtfsrt',
  templateUrl: './gtfsrt.component.html',
  styleUrls: ['./gtfsrt.component.scss']
})
export class GtfsrtComponent implements OnInit {

  @ViewChild('dataContainer') dataContainer: ElementRef;

  map: any
  routes
  wsdata
  stops
  baseLayers
  stoptimes
  stoptimesbasic
  //todo: change to v2

  // data lable in card
  card
  isDark
  cardHeight
  color
  direction
  headsign
  leaving_in_label
  leaving_in
  bodyHeight
  stopTimes
  stopGuide
  stopNames
  next_in_label
  next_in
  ActiveTrain  = {}
  SelectedTrain = []
  routesinfo
  activeRoutes
  incomingTrain = []

  // {station_id: , trips:  {in: ,out: }}
  constructor(private _gtfsws: GtfsrtwsService,
    private gtfsService: GtfsService
  ) { }



  async ngOnInit() {
    //this.dataContainer.nativeElement.innerHTML =  this.getRender()
    this.loadbaselayers()

    function style(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 2,
        fillColor: "#ff7800",
        color: "#ff0000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
      });
    };


this.routes = await this.gtfsService.getRoutesBasic()


    this.loadGeojson()
    await this.loadStoptimes()
    await this.loadStation()
    //await this.getTripsAtStop("PP01")



    L.control.layers(this.baseLayers).addTo(this.map);
    this.map.on('click', (e) => { console.log(e.latlng); });
    // let marker = new L.Marker();

    let icon = new L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/leaflet/images/marker-icon.png',
      shadowUrl: 'assets/leaflet/images/leaflet/marker-shadow.png'
    })



    const trainLocationMarkers = {}



    // get data from web socket
    this._gtfsws.listen('gtfsrt').subscribe(async data => {

      this.wsdata = JSON.stringify(data, null, 2)
      // // DEBUG: data from webservice
      //console.log('93..........', this.wsdata)

      const route_name = data['header']['route_name']
      const route_id = data['header']['route_id']
      const direction = data['header']['direction']
      const headsign = data['header']['headsign']
      const runtime =  data['header']['runtime']
      const time_now_sec = data['entity']['vehicle']['trip']['time_now_sec']
      const start_time_secs = data['entity']['vehicle']['trip']['start_time_secs']
      const end_time_secs = data['entity']['vehicle']['trip']['end_time_secs']
      const start_time = data['entity']['vehicle']['trip']['start_time']
      const end_time = data['entity']['vehicle']['trip']['end_time']
      const trip_id = data['entity']['vehicle']['trip']['trip_id']
      // // TODO: display info on marker
      const tripEntity = data['entity']['id']
      const vehicle = data['entity']['vehicle']
      const latitude = data['entity']['vehicle']['position']['latitude']
      const longitude = data['entity']['vehicle']['position']['longitude']
      const stoptimes = data['entity']['vehicle']['stoptimes']
      const trainLatLng = new L.LatLng(latitude, longitude);


      // get data
      this.routesinfo = await this.gtfsService.getRouteInfo()

      // getdata
      const routeinfowithtrips = await this.gtfsService.getrouteinfowithtrip(trip_id);

      //filter again
      const routetrips = routeinfowithtrips.filter(obj => {
        return this.checktime(obj.start_time, obj.end_time)
      })

      //debug
      //console.log('117....',trip_id,filter)
      const nextstation = routetrips.map(obj => {

          const selectStoptimes = obj.stoptimes.filter(st_obj =>{
            // filter next time check depature_time less than timenow [0]
            return this.findNextTrip(st_obj.arrival_time)
          })
          obj.selectStoptimes = _.first(selectStoptimes)

        return obj
      })

      // // DEBUG: success ? filter next station

      const nexttrip = nextstation[0].selectStoptimes


      //console.log('130....',nexttrip)
      // // TODO: filter with time select next station

      function onTrainClick(e) {

        const html = `
        <div class="card" style="width: 16rem;">
          <div class="card-header" style="background-color:${e.target.color}; padding: 0.5rem 0.15rem !important;">
           <div class="row">
             <div class="col-md-3">
             <svg width="50px" height="50px" viewBox="-10 -10 80 80">
               <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                 <circle fill="#FFFFFF" cx="32" cy="32" r="32"></circle>
                 <path
                   d="M20.7894737,31.0526316 L43.5263158,31.0526316 L43.5263158,21.5789474 L20.7894737,21.5789474 L20.7894737,31.0526316 Z M40.6842105,42.4210526 C39.1115789,42.4210526 37.8421053,41.1515789 37.8421053,39.5789474 C37.8421053,38.0063158 39.1115789,36.7368421 40.6842105,36.7368421 C42.2568421,36.7368421 43.5263158,38.0063158 43.5263158,39.5789474 C43.5263158,41.1515789 42.2568421,42.4210526 40.6842105,42.4210526 L40.6842105,42.4210526 Z M23.6315789,42.4210526 C22.0589474,42.4210526 20.7894737,41.1515789 20.7894737,39.5789474 C20.7894737,38.0063158 22.0589474,36.7368421 23.6315789,36.7368421 C25.2042105,36.7368421 26.4736842,38.0063158 26.4736842,39.5789474 C26.4736842,41.1515789 25.2042105,42.4210526 23.6315789,42.4210526 L23.6315789,42.4210526 Z M17,40.5263158 C17,42.2025263 17.7389474,43.6905263 18.8947368,44.7326316 L18.8947368,48.1052632 C18.8947368,49.1473684 19.7473684,50 20.7894737,50 L22.6842105,50 C23.7364211,50 24.5789474,49.1473684 24.5789474,48.1052632 L24.5789474,46.2105263 L39.7368421,46.2105263 L39.7368421,48.1052632 C39.7368421,49.1473684 40.5793684,50 41.6315789,50 L43.5263158,50 C44.5684211,50 45.4210526,49.1473684 45.4210526,48.1052632 L45.4210526,44.7326316 C46.5768421,43.6905263 47.3157895,42.2025263 47.3157895,40.5263158 L47.3157895,21.5789474 C47.3157895,14.9473684 40.5326316,14 32.1578947,14 C23.7831579,14 17,14.9473684 17,21.5789474 L17,40.5263158 Z"
                   fill="${e.target.color}"></path>
               </g>
             </svg>
             </div>
             <div class="col-md-5">
               <p style="color: #ffffff; margin: 2px 0;">เส้นทาง</p>
               <p style="color: #ffffff; margin: 2px 0;">${e.target.headsign}</p>
               <p style="color: #ffffff; margin: 2px 0;">ขบวนรถ</p>
               <p style="color: #ffffff; margin: 2px 0;">${e.target.trip_id}</p>
             </div>
             <div class="col-md-3">
               <p style="color: #ffffff; margin: 2px 0;">เวลาที่ใช้</p>
               <p style="color: #ffffff; margin: 2px 0;">${e.target.runtime} m.</p>
             </div>
          </div>
        </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">สถานีถัดไป ${e.target.nextstop}</li>
            <li class="list-group-item">arrival: ${e.target.arrival_time} departure: ${e.target.departure_time}</li>
          </ul>
     </div>
        `
        const popup = e.target.getPopup();
        popup.setContent(html);
        popup.update();
      }  // end function onMarkerClick




      if (this.ActiveTrain.hasOwnProperty(tripEntity)) {
        // new trip
        if (trainLocationMarkers[tripEntity] !== undefined) {
          trainLocationMarkers[tripEntity].setLatLng(trainLatLng)
        }


      } else {
        // exist trip
        this.ActiveTrain[tripEntity] = vehicle

        //// TODO: 1 create marker
        let marker = this.createMarker(trainLatLng, route_name)
        marker.addTo(this.map).bindPopup(`${tripEntity}`)
        // marker function
        marker.trip_id = trip_id
        marker.start_time = start_time
        marker.end_time = end_time
        marker.direction = "North"
        marker.stoptimes = stoptimes
        marker.color = this.getColor(route_name)
        marker.headsign = headsign
        marker.runtime = runtime

        marker.nextstop = nexttrip.stop_id
        marker.arrival_time = nexttrip.arrival_time
        marker.departure_time = nexttrip.departure_time

        //construct object
        const obj = {
          stop_id: nexttrip.stop_id
        }
        //assign variable
        let tripin
        let tripout
        // direction
        if (direction) {

          tripout = {trip_id: trip_id, start_time: start_time, end_time: end_time, direction: direction}
          obj['tripout'] = tripout

        } else {
          tripin = {trip_id: trip_id, start_time: start_time, end_time: end_time, direction: direction}
          obj['tripin'] = tripin
        }


        this.incomingTrain.push(obj)

        //console.log('281......', this.incomingTrain)


        marker.on('click', onTrainClick);
        trainLocationMarkers[tripEntity] = marker

      }

      // check train over due
      for (let key in this.ActiveTrain) {
        if (time_now_sec > this.ActiveTrain[key]['trip']['end_time_secs']) {
          //console.log(`over due delete .. ${ActiveTrain[key]}`)
          delete this.ActiveTrain[key]
        } else {
          //console.log("not over due")
        }
      }

      // delete marker of overdue
      for (let key in trainLocationMarkers) {
        if (this.ActiveTrain.hasOwnProperty(key)) {
          //console.log(`${key} still on tracks`)
        } else {
          const marker = trainLocationMarkers[key]
          this.map.removeLayer(marker)
          //console.log(`${key} remove marker`)
          delete trainLocationMarkers[key]
        }
      }



    })  // end web service

  }  //init

  loadbaselayers() {
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const landUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const thunAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const osmMap = new L.tileLayer(osmUrl, { attribution: osmAttrib });
    const lightMap = new L.tileLayer(landUrl, { attribution: thunAttrib });

    const googleStreets = new L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    const latLon = L.latLng(13.788593154063312, 100.44842125132114);
    this.map = L.map('map').setView(latLon, 12);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.attributionControl.setPrefix('');

    this.baseLayers = {
      "OSM Map": osmMap,
      "Light Map": lightMap,
      "googleStreets": googleStreets,
      "googleHybrid": googleHybrid,
      "googleSat": googleSat,
      "googleTerrain": googleTerrain
    };
  }

  loadGeojson() {

    // load geojson with new L.GeoJSON()
    const purple_line = new L.GeoJSON.AJAX("/assets/dist/kml/purple.geojson", {
      style: function(feature) {
        return {
          color: "purple"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const blue_line = new L.GeoJSON.AJAX("/assets/dist/kml/blue.geojson", {
      style: function(feature) {
        return {
          color: "#214374"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const blue_chalearm_line = new L.GeoJSON.AJAX("/assets/dist/kml/blue_chalearm.geojson", {
      style: function(feature) {
        return {
          color: "#2a5491"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const blue_extend_line = new L.GeoJSON.AJAX("/assets/dist/kml/blue_extend.geojson", {
      style: function(feature) {
        return {
          color: "#7f98bd"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const orange_line = new L.GeoJSON.AJAX("/assets/dist/kml/orange.geojson", {
      style: function(feature) {
        return {
          color: "#FF6600"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const dark_green_line = new L.GeoJSON.AJAX("/assets/dist/kml/dark_green.geojson", {
      style: function(feature) {
        return {
          color: "#458B00"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const light_green_line = new L.GeoJSON.AJAX("/assets/dist/kml/light_green.geojson", {
      style: function(feature) {
        return {
          color: "#66CD00"
        };
      }
    });

    // load geojson with new L.GeoJSON()
    const light_green_extend_line = new L.GeoJSON.AJAX("/assets/dist/kml/light_green_extend.geojson", {
      style: function(feature) {
        return {
          color: "#66CD00"
        };
      }
    });
    blue_line.addTo(this.map);
    purple_line.addTo(this.map);
    blue_chalearm_line.addTo(this.map);
    blue_extend_line.addTo(this.map);
    orange_line.addTo(this.map);
    dark_green_line.addTo(this.map);
    light_green_line.addTo(this.map);
    light_green_extend_line.addTo(this.map);
  }


  async loadStation() {
    this.stops = await this.gtfsService.getStops();
    // // DEBUG:

    // // TODO: add marker property
    this.stops.forEach(stop => {
      //console.log('423......', stop)
      //icon
      let icon = new L.icon({
        iconSize: [18, 15],
        iconAnchor: [0, 0],
        iconUrl: environment.iconbase + stop.icon,
      })
      //location
      const stationLatLng = new L.LatLng(stop.stop_lat, stop.stop_lon);
      let marker = new L.Marker();
      marker.setIcon(icon);
      marker.setLatLng(stationLatLng)
      //// TODO: click marker  update content
      // add bind popup after addTo map
      marker.addTo(this.map)
      marker.bindPopup("upload...")
      marker.stop_id = stop.stop_id
      console.log('439.....', stop.stop_id)
      console.log('440 .... ',this.incomingTrain)

      const train_onstops = this.incomingTrain.filter(obj => {
        console.log('444....', obj)
        return true
      })


      console.log('446 .stopid, train on stop... ',stop.stop_id,train_onstops.length)


      // marker function
      function onMarkerClick(e) {
        const html = `
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>สถานี ${stop.stop_id}-${stop.stop_name} </th>
            </tr>
          </thead>
          <tbody>
            <tr>

            </tr>
            <tr>
              
            </tr>
            </tbody>
          </table>
        `
        const popup = e.target.getPopup();
        popup.setContent(html);
        popup.update();
      }  // end function onMarkerClick
      // cb to onMarkerClick
      marker.on('click', onMarkerClick);

    })
  }

  async loadStoptimes() {
    const agency_key = "MRTA_Transit"
    const route_id = "00011"
    this.stoptimes = await this.gtfsService.getStopTimes(agency_key, route_id);
    //console.log(this.stoptimes)

  }

  async getTripsAtStop(trip_id) {
    const agency_key = "MRTA_Transit"
    this.stoptimesbasic = await this.gtfsService.getStopTimesBasic(agency_key, trip_id);

    const selectedStoptimes = await this.stoptimesbasic.filter(stoptime => {
      return stoptime.trip_id === trip_id
    })

    if (selectedStoptimes.length > 0) {
      const intime = selectedStoptimes.filter(stoptime => {
        //return this.checktime(stoptime.arrival_time, stoptime.departure_time)
        return this.findNextTrip(stoptime.arrival_time)
      })
      // lastest
      // console.log(trip_id)
      const incomingtrip = _.last(intime)
      return incomingtrip
    }
  }


  findNextTrip(arrival_time: any): any {

    const format = 'hh:mm:ss'
    //const CurrentDate = moment().subtract('hours',5);
    //console.log('CurrentDate........',  CurrentDate.format("HH:mm:ss"))
    //const CurrentDate = moment().subtract(5,'hours');
    const CurrentDate = moment()
    let timenow = CurrentDate.format("HH:mm:ss")

    //console.log('448........arrival_time < timenow',arrival_time,timenow )
    // // TODO: convert to sec
    const arrival_time_secs = this.getsecond(arrival_time)
    const timenow_secs = this.getsecond(timenow)

    //console.log('timenow_secs,arrival_time_secs',timenow_secs,arrival_time_secs)
    if (arrival_time_secs > timenow_secs) {
      //console.log('true')
      return true
    } else {
      //console.log('false')
      return false
    }
  }



  getColor(color) {
    switch (color) {
      case 'orange':
        return 'orange';
      case 'green':
        return 'green';
      case 'blue':
        return 'blue';
      case 'purple':
        return 'purple';
      case 'blue':
        return 'blue';
      default:
        return 'white';
    }
  }

  getsecond(time) {
    const seconds = moment(time, 'HH:mm:ss: A').diff(moment().startOf('day'), 'seconds');
    return seconds
  }

  createMarker(latlng, color) {
    return new L.CircleMarker(latlng, {
      radius: 8,
      fillOpacity: 0.8,
      color: 'black',
      fillColor: this.getColor(color),
      weight: 2
    });
  }

  checktime(start_time, endtime_time) {
    const format = 'hh:mm:ss'
    //Adjust time
    //const CurrentDate = moment().subtract('hours',5);
    //const CurrentDate = moment().subtract(5,'hours');
    const CurrentDate = moment()
    //console.log('CurrentDate........',  CurrentDate.format("HH:mm:ss"))
    // console.log('start_time',start_time)
    // console.log('endtime_time',endtime_time)
    let timenow = CurrentDate.format("HH:mm:ss")
    console.log('timenow', timenow)
    const time = moment(timenow, format)
    const at = moment(start_time, format)
    const dt = moment(endtime_time, format)

    if (time.isBetween(at, dt)) {
      return true
    } else {
      return false
    }
  }



  getRender() {
    this.isDark = true
    this.cardHeight = "40"
    this.color = "#ff0000"
    this.direction = "North"
    this.headsign = "Taoboon"
    this.leaving_in_label = "leaving_in_label"
    this.leaving_in = "leaving_i"
    this.bodyHeight = "100"
    this.stopTimes = "07:00:00"
    this.stopGuide = "stopGuide"
    this.stopNames = "stopNames"
    this.next_in_label = "next_in_label"
    this.next_in = "next_in"

    return `
    <div
      class="card ${this.isDark ? 'dark' : 'light'}"
      style="height: ${this.cardHeight}px"
    >
  <div class="header" style="background-color: ${this.color}; width: 290px">
    <div class="bus_logo">
      <svg width="50px" height="50px" viewBox="-10 -10 80 80">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <circle fill="#FFFFFF" cx="32" cy="32" r="32"></circle>
          <path
            d="M20.7894737,31.0526316 L43.5263158,31.0526316 L43.5263158,21.5789474 L20.7894737,21.5789474 L20.7894737,31.0526316 Z M40.6842105,42.4210526 C39.1115789,42.4210526 37.8421053,41.1515789 37.8421053,39.5789474 C37.8421053,38.0063158 39.1115789,36.7368421 40.6842105,36.7368421 C42.2568421,36.7368421 43.5263158,38.0063158 43.5263158,39.5789474 C43.5263158,41.1515789 42.2568421,42.4210526 40.6842105,42.4210526 L40.6842105,42.4210526 Z M23.6315789,42.4210526 C22.0589474,42.4210526 20.7894737,41.1515789 20.7894737,39.5789474 C20.7894737,38.0063158 22.0589474,36.7368421 23.6315789,36.7368421 C25.2042105,36.7368421 26.4736842,38.0063158 26.4736842,39.5789474 C26.4736842,41.1515789 25.2042105,42.4210526 23.6315789,42.4210526 L23.6315789,42.4210526 Z M17,40.5263158 C17,42.2025263 17.7389474,43.6905263 18.8947368,44.7326316 L18.8947368,48.1052632 C18.8947368,49.1473684 19.7473684,50 20.7894737,50 L22.6842105,50 C23.7364211,50 24.5789474,49.1473684 24.5789474,48.1052632 L24.5789474,46.2105263 L39.7368421,46.2105263 L39.7368421,48.1052632 C39.7368421,49.1473684 40.5793684,50 41.6315789,50 L43.5263158,50 C44.5684211,50 45.4210526,49.1473684 45.4210526,48.1052632 L45.4210526,44.7326316 C46.5768421,43.6905263 47.3157895,42.2025263 47.3157895,40.5263158 L47.3157895,21.5789474 C47.3157895,14.9473684 40.5326316,14 32.1578947,14 C23.7831579,14 17,14.9473684 17,21.5789474 L17,40.5263158 Z"
            fill="${this.color}"></path>
        </g>
      </svg>
    </div>
    <div class="direction">${this.direction}</div>
    <div class="headsign">${this.headsign}</div>
    <div class="leaving-in-label">${this.leaving_in_label}</div>
    <div class="leaving-in">${this.leaving_in}</div>
  </div>
  <div class="body" style="height: ${this.bodyHeight}px">
    <div class="stop-times">
      ${this.stopTimes}
    </div>
    ${this.stopGuide}
    <div class="stop-names">
      ${this.stopNames}
    </div>
    <div class="next-in-box">
      <div class="next-in-label">${this.next_in_label}</div>
      <div class="next-in">${this.next_in}</div>
    </div>
  </div>
</div>
    `
  }


  loadRoute (data: NgForm) {
    const keys = Object.keys(data.value);
    const route_id = keys.filter( (key) => data.value[key]).join();
    console.log(route_id)
    this.activeRoutes = this.routesinfo.filter(obj => {
      return (this.checktime(obj.start_time,obj.end_time) && obj.route_id == route_id)
    })

  }


}

//
// 93.......... {
//   "header": {
//     "gtfs_realtime_version": "2.0",
//     "incrementality": "FULL_DATASET",
//     "timestamp": "06:56:52",
//     "route_name": "blue",
//     "route_id": "00014",
//     "direction": "1",
//     "headsign": "HUA to TAO",
//     "runtime": "34"
//   },
//   "entity": {
//     "id": "blue-070346",
//     "vehicle": {
//       "trip": {
//         "trip_id": "070346",
//         "start_time_secs": "24210",
//         "end_time_secs": "26266",
//         "time_now_sec": "25012",
//         "start_time": "06:43:30",
//         "end_time": "07:17:46"
//       },
//       "position": {
//         "latitude": "13.74945882773",
//         "longitude": "100.563533787612"
//       }
//     }
//   }
// }
