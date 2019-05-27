import { Component, OnInit ,Inject } from '@angular/core';
import { environment } from "../../../environments/environment";
import { WebsocketService} from '../../services/websocket.service'
import { DOCUMENT } from '@angular/common';
declare let L;


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {
  configfiles = environment.configfiles;
  apikey = 'OFCE5UCISN.A6u3fH6hKP.uhcTNtKFfk==';
  map: any;
  wsdata;
  constructor(@Inject(DOCUMENT) private document,
    private _websocket: WebsocketService) { }

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

    function style (feature, latlng) {
        return L.circleMarker(latlng, {
                     radius: 6,
                     fillColor: "#ff7800",
                     color: "#ff0000",
                     weight: 1,
                     opacity: 1,
                     fillOpacity: 0.8
                 });
    };



    const geojsonLayer = new L.GeoJSON.AJAX("/assets/dist/kml/simulate_blueline.geojson",{
      pointToLayer: style
    });
    geojsonLayer.addTo(this.map);

    L.control.layers(baseLayers).addTo(this.map);
    this.map.on('click', (e) => { console.log(e.latlng); });
    let marker = new L.Marker();
    let icon = new L.icon({
            iconSize: [ 25, 41 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'assets/leaflet/images/marker-icon.png',
            shadowUrl: 'assets/leaflet/images/leaflet/marker-shadow.png'
    })
    marker.setIcon(icon);
    // connect to listen to event
    this._websocket.listen('gtfsrt').subscribe(data => {
      // console.log(data)

      this.wsdata = JSON.stringify(data)
      const latitude = data['entity']['vehicle']['position']['latitude']
      const longitude = data['entity']['vehicle']['position']['longitude']
      console.log('latitude longitude', latitude, longitude)
      var newLatLng = new L.LatLng(latitude, longitude);
      marker.setLatLng([latitude,longitude]).update()
      marker.addTo(this.map).bindPopup('train!')
    })
  }

}
