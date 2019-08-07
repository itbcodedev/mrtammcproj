import { Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
//import { CctvserviceService } from '../../services/cctvservice.service';
import { CctvService } from '../../services/cctv.service';
import * as jsmpeg from 'jsmpeg';
declare let L;
declare var $: any;

import { DOCUMENT } from '@angular/common';
import { Inject }  from '@angular/core';


@Component({
  selector: 'app-cctv',
  templateUrl: './cctv.component.html',
  styleUrls: ['./cctv.component.scss']
})
export class CctvComponent implements OnInit {
  mycasvas: any;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  map: any;
  cctvlocations: any;

  constructor(private _cctv: CctvService,
             @Inject(DOCUMENT) private document: Document,
             elementRef: ElementRef ) {
  }

  ngOnInit() {
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const landUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const thunAttrib = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const osmMap = L.tileLayer(osmUrl, { attribution: osmAttrib });
    const lightMap = L.tileLayer(landUrl, { attribution: thunAttrib });

    this.map = L.map('map').setView([13.704654, 100.558345], 10);
    this.map.panTo([13.704654, 100.558345]);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.attributionControl.setPrefix('');

    var baseLayers = {
      "OSM Map": osmMap,
      "Light Map": lightMap
    };

    L.control.layers(baseLayers).addTo(this.map);

  }

  ngAfterViewInit() {
    this.getCctv();
    //console.log(this.canvas.nativeElement);
    const ws = new WebSocket("ws://192.168.3.48:5000")
    const canvas = this.canvas.nativeElement;
    var player = new jsmpeg(ws, {canvas:canvas, autoplay:true,audio:false,loop: true});
  }


  getCctv() {
    let get_cctv = this._cctv.getCctv()
    get_cctv.subscribe((datas) => {
      console.log(datas);
      this.cctvlocations = datas;
      this.cctvlocations.forEach(cctv => {
        //let ws = new WebSocket(`${cctv.protocol}://${cctv.host}:${cctv.port}`);
        //console.log(ws);
        const marker = L.marker([cctv.latitude, cctv.longitude], {
          icon: L.AwesomeMarkers.icon({ icon: 'camera', prefix: 'fa', markerColor: 'blue' }),
          forceZindex: 100
        });
        var customOptions = {
          'maxWidth': '700',
          'className': 'custom'
        }

        const html = `<table >
                          <tr>
                            <th class="tg-0lax">รหัส<br></th>
                            <th class="tg-0lax">${cctv.code}<br></th>
                          </tr>
                          <tr>
                            <td class="tg-0lax">ชื่อกล้อง</td>
                            <td class="tg-0lax">${cctv.name}</td>
                          </tr>
                          <tr>
                            <td class="tg-0lax">source host<br></td>
                            <td class="tg-0lax">${cctv.protocol}://${cctv.host}</td>
                          </tr>
                          <tr>
                            <td class="tg-0lax">stream port<br></td>
                            <td class="tg-0lax">ws://192.168.3.48:${cctv.port}</td>
                          </tr>
                          <tr>
                            <td colspan="2">

                            <canvas id="canvas" ></canvas>

                            </td>
                          </tr>
                        </table>`;

        const popup = L.popup().setContent(html);

        marker.bindPopup(popup, customOptions).openPopup()
              .on('popupopen', this.showcctv);
        marker.addTo(this.map);
        //this.mycasvas = this.document.getElementById("canvas");
        //console.log(this.mycasvas);
      });
    });
  }

  showcctv(e) {
    //console.log(e);
    //console.log(e.latlng);
    //console.log(e.target.getPopup());
    //console.log(this.canvas.nativeElement);
    var popup = e.target.getPopup();
    var content = popup.getContent();
    // get source
    var marker = e.popup._source;
    //console.log(marker);
    //console.log(this.document);
    //console.log($('#canvas'));
    const ws = new WebSocket("ws://192.168.3.48:5000")
    $('#canvas').width(350);
    $('#canvas').height(260);
    var player = new jsmpeg(ws, {canvas: $('#canvas')[0], autoplay:true,audio:false,loop: true});
  }
}
