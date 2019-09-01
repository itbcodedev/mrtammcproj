import { Component, OnInit , ViewChild, ElementRef, Input, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {GtfsService} from '../../services/gtfs2.service'
import { ToastrService } from 'ngx-toastr';
declare let L;
import * as $ from 'jquery';

@Component({
  selector: 'app-routeformat',
  templateUrl: './routeformat.component.html',
  styleUrls: ['./routeformat.component.scss']
})
export class RouteformatComponent implements OnInit {
  @ViewChild("map", { static: true })
  public mapElement: ElementRef

  @ViewChild("mapdiv", { static: true })
  public mapDiv: ElementRef;

  routeformatForm: FormGroup;

  map
  height
  latitude
  longitude
  controllerLayer
  baseLayers
  defaultColDef
  columnDefs
  rowData

  gridApi
  gridColumnApi

  routes
  allstations
  stations
  station

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private _gtfsservice: GtfsService
  ) { 
    this.routeformatForm = this.fb.group({
      route: ['', Validators.required ],
      color: ['', Validators.required ],
      station_icon: ['', Validators.required ],
      train_icon: ['', Validators.required ]
    })

    this.height = 775 + "px";
  }

  ngOnInit() {
    const latLon = L.latLng(13.788593154063312, 100.44842125132114);
    this.map = L.map(this.mapElement.nativeElement).setView(latLon, 12);

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
    });

    const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    this.baseLayers = {
      'OSM Map': osmMap,
      'Light Map': lightMap,
      'googleStreets': googleStreets,
      'googleHybrid': googleHybrid,
      'googleSat': googleSat,
      'googleTerrain': googleTerrain
    };


    this.controllerLayer = L.control.layers(this.baseLayers);
    this.controllerLayer.addTo(this.map);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);


    this._gtfsservice.getallstations().then( obj => {
      this.allstations = obj
      console.log(this.allstations)
      this.routes = Object.keys(obj)
      console.log(this.routes)
    })

    
  }

  onFileChange(event, field) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      // just checking if it is an image, ignore if you want
      if (!file.type.startsWith('image')) {
        this.routeformatForm.get(field).setErrors({
          required: true
        });
        this.cd.markForCheck();
      } else {
        // unlike most tutorials, i am using the actual Blob/file object instead of the data-url
        this.routeformatForm.patchValue({
          [field]: file
        });
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      }
    }

  }

  submitRouteFormatData(){
    const formData = new FormData();
    Object.entries(this.routeformatForm.value).forEach(
      ([key, value]: any[]) => {
        formData.set(key, value);
      } 
    )
    console.log(formData)
  }
}
