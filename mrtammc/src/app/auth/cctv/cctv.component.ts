import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CctvService} from '../../services/cctv.service';
import { ToastrService } from 'ngx-toastr';
declare let L;


@Component({
  selector: 'app-cctv',
  templateUrl: './cctv.component.html',
  styleUrls: ['./cctv.component.scss']
})
export class CctvComponent implements OnInit {

  @ViewChild("map")
  public mapElement: ElementRef;

  @ViewChild("mapdiv")
  public mapDiv: ElementRef;

  protocols = ['http', 'https', 'ws', 'rtsp']
  cctvForm: FormGroup;
  map
  height
  latitude
  longitude
  controllerLayer
  baseLayers

  columnDefs
  rowData
  defaultColDef
  gridApi
  gridColumnApi

  cctvstatus

  constructor(
              public cctvApi: CctvService,
              private fb: FormBuilder,
              private toastr: ToastrService,
              public ngxSmartModalService: NgxSmartModalService) {
    this.cctvForm = this.fb.group({
      code: ['', Validators.required ],
      name: ['', Validators.required ],
      protocol: ['', Validators.required ],
      host: ['', Validators.required ],
      port: ['', Validators.required ],
      username: ['', Validators.required ],
      password: ['', Validators.required ],
      latitude: ['', Validators.required ],
      longitude: ['', Validators.required ],
      description: ['', Validators.required ]
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

    this.map.on('click', (e) => {
      var coord = e.latlng;
      this.latitude = coord.lat;
      this.longitude = coord.lng;
    });

    this.defaultColDef = { resizable: true };

    this.columnDefs = [
        {headerName: 'Code', field: 'code', editable: true },
        {headerName: 'Name', field: 'name', editable: true },
        {headerName: 'Protocol', field: 'protocol', editable: true},
        {headerName: 'Host', field: 'host' , editable: true},
        {headerName: 'Port', field: 'port' , editable: true},
        {headerName: 'Username', field: 'username', editable: true},
        {headerName: 'Password', field: 'password', editable: true},
        {headerName: 'Latitude', field: 'latitude' , editable: true},
        {headerName: 'Longitude', field: 'longitude' , editable: true},
        {headerName: 'Description', field: 'Description', editable: true},
    ]

      this.cctvApi.getCctv().subscribe(result => {
        this.rowData = result
      },(error) =>{
        console.log(error)
      })

      this.getSeverStatus()
  }

  ngAfterViewInit() {

  }

  submitCctvData() {
    if (!this.cctvForm.valid) {
      this.toastr.error("กรอกข้อมูลผิดพลาด: ไม่ครบถ้วน")
      return false;
    } else {
      if (window.confirm('ต้องการที่จะ บันทึกข้อมูลหรือไม่?')) {
        const data = this.cctvForm.value;
        this.cctvApi.AddCctv(data).subscribe(result => {
          console.log(result);
          this.toastr.success(JSON.stringify(result))
        }, (error) => {
          console.log(error);
          this.toastr.error(JSON.stringify(error))
        });
      }
    }

  }

  getSeverStatus() {
    this.cctvApi.getserverstatus().subscribe(result => {
      this.cctvstatus = result
    })
  }

  restartServer() {
    this.cctvApi.restartserver().subscribe(result => {
      console.log(result);
      this.toastr.success(JSON.stringify(result))
    },(error) => {
      console.log(error);
      this.toastr.error(JSON.stringify(error))
    });

    this.getSeverStatus()
  }



  onGridReady(params) {
    //console.log(params)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    // const allColumnIds = [];
    // this.gridColumnApi.getAllColumns().forEach(function(column) {
    //   allColumnIds.push(column.colId);
    // });
    // this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  onCellValueChanged(params: any) {
    this.rowData[params.rowIndex] = params.data;
    const obj = this.rowData;
    console.log(obj);
  }

  refresh() {
    this.cctvApi.getCctv().subscribe(result => {
      this.rowData = result;
    }, ( error ) => {
      console.log( error );
    });
  }
}
