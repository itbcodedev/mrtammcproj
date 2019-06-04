import { Component, OnInit } from '@angular/core';
import { GtfsrtwsService } from '../../services/gtfsrtws.service'

declare let L;

@Component({
  selector: 'app-gtfsrt',
  templateUrl: './gtfsrt.component.html',
  styleUrls: ['./gtfsrt.component.scss']
})
export class GtfsrtComponent implements OnInit {
  map: any;
  wsdata;

  constructor(private _gtfsws: GtfsrtwsService) { }

  ngOnInit() {
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const landUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const thunAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const osmMap = new L.tileLayer(osmUrl, { attribution: osmAttrib });
    const lightMap = new L.tileLayer(landUrl, { attribution: thunAttrib });

    this.map = new L.map('map').setView([13.773125, 100.542462], 10);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.attributionControl.setPrefix('');

    var baseLayers = {
      "OSM Map": osmMap,
      "Light Map": lightMap
    };

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


    const geojsonLayer = new L.GeoJSON.AJAX("/assets/dist/kml/simulate_blueline.geojson", {
      pointToLayer: style
    });
    geojsonLayer.addTo(this.map);

    L.control.layers(baseLayers).addTo(this.map);
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
      //console.log(this.wsdata)
      const tripEntity = data['entity']['id']
      const vehicle = data['entity']['vehicle']
      const latitude = data['entity']['vehicle']['position']['latitude']
      const longitude = data['entity']['vehicle']['position']['longitude']
      const trainLatLng = new L.LatLng(latitude, longitude);


      if ( ActiveTrain.hasOwnProperty(tripEntity) ) {
        // new trip
        trainLocationMarkers[tripEntity].setLatLng(trainLatLng).update()
      } else {
        // exist trip
        ActiveTrain[tripEntity] = vehicle
        let marker = new L.Marker();
        marker.setIcon(icon);
        marker.setLatLng(trainLatLng)
        marker.addTo(this.map).bindPopup(tripEntity)
        trainLocationMarkers[tripEntity] = marker
      }

      console.log(trainLocationMarkers)
    })

  }

}
