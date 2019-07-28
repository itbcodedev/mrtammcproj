import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CctvService {

  baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  AddCctv(data) {
    const url = this.baseUrl + '/api/v2/cctvs/create'
    return this._http.post(url, data)
  }

  getCctv() {
    const url = this.baseUrl + '/api/v2/cctvs'
    return this._http.get(url)
  }
}
