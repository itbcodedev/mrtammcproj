import { Component, OnInit,Renderer2, Inject } from '@angular/core';
import { ParkingserviceService } from '../../services/parkingservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { GtfsService } from '../../services/gtfs.service';
import { Shape } from '../../models/shape.model';
import { ShapeDetail } from '../../models/shape_detail';
import { forkJoin } from "rxjs/observable/forkJoin";

declare let L;

@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.scss']
})
export class ParkingComponent implements OnInit {
  parkings: any;
  parkinglocations: any;
  apikey = 'OFCE5UCISN.A6u3fH6hKP.uhcTNtKFfk==';
  map: any;
  shapes: Shape[];
  tripPath: any;
  markers = [];
  isLow = false;
  isMedium = false;
  isHigh = true;
  totoalncarrem = 0;
  totalcapacity = 0;
  parkingclass = {
    "parking-1": this.isLow,
    "parking-2": this.isMedium,
    "parking-3": this.isHigh
  }

  constructor(public _parking: ParkingserviceService,
    private gtfsService: GtfsService,
    @Inject(DOCUMENT) private document,
    private renderer: Renderer2,
    private _router: Router,
  ) { }

  ngOnInit() {
    //this.renderer.removeClass(this.document.body, 'sidebar-open');
    //this.renderer.addClass(this.document.body, 'sidebar-collapse');
    this.document.location.hostname;
    console.log(this.document.location.hostname);

    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const landUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const thunAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const osmMap = L.tileLayer(osmUrl, { attribution: osmAttrib });
    const lightMap = L.tileLayer(landUrl, { attribution: thunAttrib });

    this.map = L.map('map').setView([13.812137914676734, 100.49212238477799], 12);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.attributionControl.setPrefix('');

    var baseLayers = {
      "OSM Map": osmMap,
      "Light Map": lightMap
    };

    L.control.layers(baseLayers).addTo(this.map);
    this.map.on('click', (e) => { console.log(e.latlng); });
    this.getShapes();
    this.getlocation();
    this.getParking();

  }

  getParking() {
    let get_parking = this._parking.getParking();
    let get_location = this._parking.getParkinglocation();
    forkJoin([get_parking, get_location]).subscribe(result=>{
      this.parkinglocations = result[1];
      this.parkings = result[0];

      //console.log(this.parkings);
      this.parkings.forEach(parking => {
        this.totoalncarrem += +parking.ncarrem
        parking.ncarrem = parking.ncarrem < 0 ? 0 : parking.ncarrem

        this.parkinglocations.forEach(pl => {
          if (parking.code == pl.code) {
            parking.capacity = pl.capacity
            parking.icon = pl.icon
            this.totalcapacity += pl.capacity
          }
        });
        parking.percent = Math.round(((parking.capacity - parking.ncarrem)/parking.capacity)*100);
        switch (true) {
          case (parking.percent < 30 ):
            parking.class="parking-1"
            break;
          case (parking.percent >= 30  && parking.percent < 70):
            parking.class="parking-2"
          break;
          case (parking.percent >= 70  && parking.percent <= 100 ):
            parking.class="parking-3"
          break;

        }
        parking.ncarrem = parking.ncarrem < 0 ? "Full" : parking.ncarrem;
      });

      this._parking.totoalncarrem = this.totoalncarrem;
      this._parking.totalcapacity = this.totalcapacity;


    });
  }


  getlocation() {
    this._parking.getParkinglocation()
    .subscribe(data => {
      this.parkinglocations = data;
      // console.log(this.parkinglocations);
      this.parkinglocations.forEach(parking => {
        const marker = L.marker([parking.latitude, parking.longitude],{
             icon: L.AwesomeMarkers.icon({icon: 'car', prefix: 'fa', markerColor: 'blue'}),
             forceZindex: 100
        });
        const customOptions ={
                            'maxWidth': '500',
                            'className' : 'tg'
                            }
        const popup =  `<table class="tg">
                          <tr>
                            <th class="tg-0lax">รหัส<br></th>
                            <th class="tg-0lax">${parking.code}<br></th>
                          </tr>
                          <tr>
                            <td class="tg-0lax">ชื่อสถานี</td>
                            <td class="tg-0lax">${parking.name}</td>
                          </tr>
                          <tr>
                            <td class="tg-0lax">จำนวนที่จอด<br></td>
                            <td class="tg-0lax">${parking.capacity} คัน</td>
                          </tr>
                          <tr>
                            <td colspan="2">
                            <img src="${parking.image}" style="width:300px;height:200px;" />
                            </td>
                          </tr>
                        </table>`;
        marker.bindPopup(popup,customOptions);
        marker.addTo(this.map);
        this.markers.push({ code: parking.code, markers: marker});
      });
    })

  }




  async getShapes() {
    const shapes: Shape[] = await this.gtfsService.getShapes();
    const shape_details: ShapeDetail[] = await this.gtfsService.getShapeDetail();
    this.shapes = shapes;
    const grouped = this.groupBy(shapes, shape => shape.shapeId);

    grouped.forEach((values, key) => {
      const color = shape_details.find(shape_detail => shape_detail.shapeId === key).color;
      const coordinates = [];
      for (const shape of values) {
        const position = new google.maps.LatLng(shape.shapePtLat, shape.shapePtLon);
        coordinates.push([shape.shapePtLat, shape.shapePtLon]);
      }
      //console.log(color);
      const polyline =  L.polyline(coordinates, {color: `#${color}`}).addTo(this.map);

    });
  }

  groupBy(list, keyGetter) {
    const shapemap = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = shapemap.get(key);
      if (!collection) {
        shapemap.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return shapemap;
  }

  getparkcode(parking) {
    //console.log(parking.code);
    //console.log(this.markers);
    const obj = this.markers.find(m =>  m.code == parking.code)
    obj.markers.openPopup();
  }
}
