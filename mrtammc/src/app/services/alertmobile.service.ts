import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AlertmobileService {
  httpOptions = { headers: new HttpHeaders(
                {
                    'Content-Type':  'application/json',
                })};

  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) { }

  sendalerts(formData: any) {
    return this._http.post("/mrta/api/mrta/Pushnotification",JSON.stringify(formData),this.httpOptions)
  }
}
