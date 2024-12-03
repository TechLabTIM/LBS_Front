import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CircularArcArea } from '../app/Model/LocationData';

@Injectable({
  providedIn: 'root'
})
export class MapService {

constructor(
  private http: HttpClient,
  @Inject('BASE_URL') private baseUrl: string
) { }

getLocationData(msisdn: string): Observable<any> {
  return this.http.get<any>(this.baseUrl + `LaunchLBS/le?msisdn=${msisdn}`);
}

}
