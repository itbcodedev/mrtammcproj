import { Component, OnInit } from '@angular/core';
import { GtfsrtwsService } from '../../services/gtfsrtws.service'
import { GtfsService } from '../../services/gtfs2.service';
import { environment } from '../../../environments/environment';
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
  //todo: change to v2
  constructor(private _gtfsws: GtfsrtwsService,
              private gtfsService: GtfsService
  ) { }

  ngOnInit() {
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
    this.loadStation()

    L.control.layers(this.baseLayers).addTo(this.map);
    this.map.on('click', (e) => { console.log(e.latlng); });
    // let marker = new L.Marker();

    let icon = new L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/leaflet/images/marker-icon.png',
      shadowUrl: 'assets/leaflet/images/leaflet/marker-shadow.png'
    })


    const ActiveTrain = {}
    const trainLocationMarkers = {}

    this._gtfsws.listen('gtfsrt').subscribe(data => {
      this.wsdata = JSON.stringify(data)
      //Debug: output data set
      //console.log(this.wsdata)
      const route_name = data['header']['route_name']
      const time_now_sec = data['entity']['vehicle']['trip']['time_now_sec']
      const start_time_secs = data['entity']['vehicle']['trip']['start_time_secs']
      const end_time_secs = data['entity']['vehicle']['trip']['end_time_secs']
      const tripEntity = data['entity']['id']
      const vehicle = data['entity']['vehicle']
      const latitude = data['entity']['vehicle']['position']['latitude']
      const longitude = data['entity']['vehicle']['position']['longitude']
      const trainLatLng = new L.LatLng(latitude, longitude);

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
        marker.addTo(this.map).bindPopup(tripEntity)
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
    })
  }

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
      const html = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>${stop.stop_id}-${stop.stop_name} </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>NEXT TRIP</td>


          </tr>
          </tbody>
        </table>
      `
      marker.addTo(this.map).bindPopup(html)
      // marker.addTo(this.map)
      // click event on station

      marker.on('click', (event) => {
        const marker = event.target
        console.log(marker)
        //var html='Test content';
        //smarker.bindPopup(html).openPopup();
      })
    })
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

  createMarker(latlng, color) {
    return new L.CircleMarker(latlng, {
      radius: 8,
      fillOpacity: 0.8,
      color: 'black',
      fillColor: this.getColor(color),
      weight: 2
    });
  }
}
