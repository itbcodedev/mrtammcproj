import { Component, OnInit } from '@angular/core';
import { GtfsrtwsService } from '../../services/gtfsrtws.service'
import { GtfsService } from '../../services/gtfs2.service';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import * as _ from 'lodash';

declare let L;

@Component({
  selector: 'app-gtfsrt',
  templateUrl: './gtfsrt.component.html',
  styleUrls: ['./gtfsrt.component.scss']
})
export class GtfsrtComponent implements OnInit {
  map: any
  wsdata
  stops
  baseLayers
  stoptimes
  //todo: change to v2
  constructor(private _gtfsws: GtfsrtwsService,
              private gtfsService: GtfsService
  ) { }

  async ngOnInit() {
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



    this.loadGeojson()
    await this.loadStoptimes()
    await this.loadStation()
    //await this.getTripsAtStop("PP01")



    L.control.layers(this.baseLayers).addTo(this.map);
    // this.map.on('click', (e) => { console.log(e.latlng); });
    // let marker = new L.Marker();

    let icon = new L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/leaflet/images/marker-icon.png',
      shadowUrl: 'assets/leaflet/images/leaflet/marker-shadow.png'
    })


    const ActiveTrain = {}
    const trainLocationMarkers = {}

    this._gtfsws.listen('gtfsrt').subscribe(async data => {
      this.wsdata = JSON.stringify(data,null,2)
      //Debug: output data set
      //console.log(this.wsdata)

      const route_name = data['header']['route_name']
      const time_now_sec = data['entity']['vehicle']['trip']['time_now_sec']
      const start_time_secs = data['entity']['vehicle']['trip']['start_time_secs']
      const end_time_secs = data['entity']['vehicle']['trip']['end_time_secs']
      const trip_id = data['entity']['vehicle']['trip']['trip_id']
      const tripEntity = data['entity']['id']
      const vehicle = data['entity']['vehicle']
      const latitude = data['entity']['vehicle']['position']['latitude']
      const longitude = data['entity']['vehicle']['position']['longitude']
      const trainLatLng = new L.LatLng(latitude, longitude);

      const stoptime: any = await this.getTripsAtStop(trip_id)
      //// DEBUG:
      //console.log(trip_id)
      //console.log(stoptime)

      if (ActiveTrain.hasOwnProperty(tripEntity)) {
        // new trip
        trainLocationMarkers[tripEntity].setLatLng(trainLatLng)
        // const oldLatLng = trainLocationMarkers[tripEntity].getLatLng()
        // const newLatLng = trainLatLng
        // trainLocationMarkers[tripEntity].movingMarker(oldLatLng,newLatLng).start()

      } else {
        // exist trip
        ActiveTrain[tripEntity] = vehicle
        // let marker = new L.Marker();
        // marker.setIcon(icon);
        // marker.setLatLng(trainLatLng)
        // marker.addTo(this.map).bindPopup(tripEntity)
        // trainLocationMarkers[tripEntity] = marker
        let marker = this.createMarker(trainLatLng, route_name)
        marker.addTo(this.map).bindPopup(`${tripEntity}`)
        trainLocationMarkers[tripEntity] = marker
      }


      for (let key in ActiveTrain) {
        if (time_now_sec > ActiveTrain[key]['trip']['end_time_secs']) {
          //console.log(`over due delete .. ${ActiveTrain[key]}`)
          delete ActiveTrain[key]
        } else {
          //console.log("not over due")
        }
      }

      for (let key in trainLocationMarkers) {
        if (ActiveTrain.hasOwnProperty(key)) {
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

    const googleStreets = new L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
    });

    const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    })

    const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    })

    this.map = new L.map('map').setView([13.76346247154659, 100.53527228372589], 12);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.attributionControl.setPrefix('');

    this.baseLayers = {
      "OSM Map": osmMap,
      "Light Map": lightMap,
      "googleStreets": googleStreets,
      "googleHybrid" : googleHybrid,
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

    blue_line.addTo(this.map);
    purple_line.addTo(this.map);
    blue_chalearm_line.addTo(this.map);
    blue_extend_line.addTo(this.map);
  }


  async loadStation() {

    this.stops = await this.gtfsService.getStops();
    console.log(this.stops)

    this.stops.forEach(stop => {
      //icon
      let icon = new L.icon({
        iconSize: [18, 15],
        iconAnchor: [0,0],
        iconUrl: environment.iconbase + stop.icon,
      })
      //location
      const stationLatLng = new L.LatLng(stop.stop_lat, stop.stop_lon);
      let marker = new L.Marker();
      marker.setIcon(icon);
      marker.setLatLng(stationLatLng)
      //// TODO: click marker
      marker.addTo(this.map)
      marker.bindPopup("upload...")
      // marker.addTo(this.map)
      // click event on station

      marker.stop_id = stop.stop_id
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
              <td> <button type="button" class="btn btn-primary btn-sm">ขบวนขาเข้า</button> </td>
            </tr>
            <tr>
              <td> <button type="button" class="btn btn-primary btn-sm">ขบวนขาออก</button> </td>
            </tr>
            </tbody>
          </table>
        `

        const popup = e.target.getPopup();
        popup.setContent(html);
        popup.update();
      }

      marker.on('click', onMarkerClick);

      // marker.on('click', (event) => {
      //   const marker = event.target
      //   console.log(marker)
      //
      //   var html='Test content';
      //   marker.bindPopup(html).openPopup();
      // })
    })
  }

  async loadStoptimes() {
    const agency_key = "MRTA_Transit"
    const route_id = "00011"
    this.stoptimes = await this.gtfsService.getStopTimes(agency_key,route_id);
    //console.log(this.stoptimes)

  }

  async getTripsAtStop(trip_id) {

    const selectedStoptimes = await  this.stoptimes.filter(stoptime => {
      return stoptime.trip_id === trip_id
    })

    if (selectedStoptimes.length > 0){
      // const intime = selectedStoptimes.filter(stoptime => {
      //   //return this.checktime(stoptime.arrival_time, stoptime.departure_time)
      //   return this.findNextTrip(stoptime.arrival_time)
      // })
      // // lastest
      // //return _.last(intime)
      return selectedStoptimes
    }
  }

  findNextTrip(arrival_time: any): any {
    const format = 'hh:mm:ss'
    //const CurrentDate = moment().subtract('hours',5);
    //console.log('CurrentDate........',  CurrentDate.format("HH:mm:ss"))
    const CurrentDate = moment()
    let timenow = CurrentDate.format("HH:mm:ss")
    if (arrival_time < timenow){
      return true
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
    const CurrentDate = moment().subtract('hours',5);
    //const CurrentDate = moment()
    console.log('CurrentDate........',  CurrentDate.format("HH:mm:ss"))
    // console.log('start_time',start_time)
    // console.log('endtime_time',endtime_time)
    let timenow = CurrentDate.format("HH:mm:ss")

    const time = moment(timenow, format)
    const at = moment(start_time, format)
    const dt = moment(endtime_time, format)

    if (time.isBetween(at, dt)) {
      return true
    } else {
      return false
    }
  }
}
