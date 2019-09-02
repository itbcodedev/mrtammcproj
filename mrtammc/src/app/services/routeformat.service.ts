import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RouteformatService {

  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) { }

  saverouteformat(formData: any) {

    let url = this.baseUrl + '/api/v2/routeformat/create'
    return this._http.post(url, formData)
  }

  getrouteformat() {
    let url = this.baseUrl + '/api/v2/routeformat'
    return this._http.get(url)
  }
}
