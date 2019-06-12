import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AlertmobileService {
  httpOptions = { headers: new HttpHeaders(
                {
                    'Content-Type':  'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': '*'
                })};

  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) { }

  sendalerts(formData: any) {
    let url = "http://122.155.204.80/mrta/api/mrta/mrta/Pushnotification"
    return this._http.post(url,JSON.stringify(formData),this.httpOptions)
  }
}
