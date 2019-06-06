import { Component, OnInit } from '@angular/core';
import { GtfsService } from '../../services/gtfs2.service';
import { environment } from '../../../environments/environment';

declare let L;

@Component({
  selector: 'app-gtfsmap',
  templateUrl: './gtfsmap.component.html',
  styleUrls: ['./gtfsmap.component.scss']
})
export class GtfsmapComponent implements OnInit {
  map
  stops
  baseLayers
  selectedStop = {}
  allStops = {}
  constructor(private gtfsService: GtfsService) { }

  ngOnInit() {
    this.loadbaselayers()

    L.control.layers(this.baseLayers).addTo(this.map);
    this.map.on('click', (e) => { console.log(e.latlng); });
    //Load data
    this.loadGeojson()
    this.loadStation()
    console.log(this.allStops)
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
      this.allStops[stop.stop_id] = stop
      //icon
      let icon = new L.icon({
        iconSize: [18, 15],
        iconAnchor: [0,0],
        iconUrl: environment.iconbase + stop.icon,
      })

      //location
      const stationLatLng = new L.LatLng(stop.stop_lat, stop.stop_lon);
      var marker = new L.marker(stationLatLng, {
        draggable: 'true'
      });
      marker.setIcon(icon);

      //marker.setLatLng(stationLatLng)
      marker.addTo(this.map).bindPopup(`${stop.stop_id}-${stop.stop_name}`)

      const position = marker.getLatLng();

      marker.setLatLng(new L.LatLng(position.lat, position.lng),{
        draggable:'true'
      });
      //add stop_id to marker
      marker.stop_id = stop.stop_id
      console.log('122 Old Marker', marker)
      //dragged event
      marker.on('click', (event => {
        const marker = event.target;
        this.selectedStop = this.allStops[marker.stop_id]
        console.log(this.allStops[marker.stop_id])
      }))
      marker.on('dragend', (event) => {
        const marker = event.target;
        console.log('126 new marker', marker.stop_id ,marker )
        // this.selectedMarker = marker
        const position = marker.getLatLng();
        console.log('129 new position', position)
        marker.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: 'true' });
        // map.panTo(new L.LatLng(position.lat, position.lng))
        this.allStops[marker.stop_id].stop_lat = position.lat
        this.allStops[marker.stop_id].stop_lon =  position.lng
        //console.log(this.allStops[stop.stop_id])
        this.selectedStop = this.allStops[marker.stop_id]
        this.gtfsService.updateStops(this.selectedStop)

      });

    })
  }


}
