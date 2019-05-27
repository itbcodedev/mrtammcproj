import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AlertmobileService {
  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) { }

  sendalerts(formData: any) {
    let url = "http://122.155.204.80/mrta/api/mrta/mrta/Pushnotification"
    return this._http.post(url,formData)
  }
}
