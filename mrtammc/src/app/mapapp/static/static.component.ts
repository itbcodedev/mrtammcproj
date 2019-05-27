import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { IParkingData, Data } from './Data'
import { ParkingserviceService } from '../../services/parkingservice.service';
import { AlertService} from '../../services/alert.service';
import { AlertmobileService } from '../../services/alertmobile.service';
import { Alert } from './alert.model';
import {FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { WebsocketService} from '../../services/websocket.service'

@Component({
  selector: 'app-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss']
})
export class StaticComponent implements OnInit {
  chart: any = []
  labels= []
  datasets=[]
  alerts: any

  alertForm: FormGroup;
  passengers=[]
  average
  constructor(private _http: HttpClient,
              public _parking: ParkingserviceService,
              public _alert: AlertService,
              public _mobile: AlertmobileService,
              private _toastr: ToastrService,
              private _websocket: WebsocketService,
              private fb: FormBuilder) { }


  pushToArray(arr, obj) {
    const existIds = arr.map( obj => obj.station)
    if ( ! existIds.includes(obj.station)) {
      arr.push(obj)
    } else {
      arr.forEach((element, index) => {
        if (element.station === obj.station) {
          arr[index] = obj
        }
      })
    }
  }


  ngOnInit() {
    this._websocket.listen('passenger').subscribe(data => {
        console.log(data)
        this.pushToArray(this.passengers, data)
        this.average = this.passengers.reduce((sum, { density }) => sum + parseInt(density), 0)/this.passengers.length
    });

    this.alertForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required]
    })

  this.getdata()
  this.getalerts()



  }

  getalerts () {
    this._alert.getalerts().subscribe( (res) => {
      this.alerts = res
    });
  }

  getdata () {
    let time;
    let datasets;

    this._parking.getParking().subscribe(async (res: any) => {
       //console.log(res)
       let code = await res.map( res => res.code);
       let date = await res.map( res => res.date);
       time = await res.map( res => res.time)[0];
       let ncarrem = await res.map( res => res.ncarrem);
       //console.log('code, date, time, ncarrem',code, date[0],time[0],ncarrem)
       //data

       datasets = this.genDataset(time, code,ncarrem);
       console.log('time,datasets',time, datasets);
    });

  }
  genDataset(time: any, code: any, ncarrem: any): any {
    let datasets = []
    console.log('code,datasets,codelength', code,ncarrem, code.length  )

    let dataset = {
                    label: [],
                    borderColor: "#FF5733",
                    data: [],
                    fill: false,
                    pointStyle: 'circle',
                    backgroundColor: '#3498DB',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    lineTension: 0,
                }

    code.forEach((c,i) => {
      // console.log(i)
      // console.log('c,n', c, ncarrem[i])
      dataset.label.push(c)
      dataset.data.push(ncarrem[i])
      datasets.push(dataset)

    });

    this.chart = new Chart('canvas', {
       type: 'line',
       data: {
         labels: code,
         datasets: datasets
       },
       options: {
         legend: {
           display: false
         },
         scales: {
           xAxes: [{
             display: true
           }],
           yAxes: [{
             display: true
           }],
         }
       }
     });

    return datasets

  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    const data = this.alertForm.value;
    this._mobile.sendalerts(data).subscribe(res => {
      console.log(res);
      this._toastr.success("Successfull send alert" + res);
    })
  }
}
