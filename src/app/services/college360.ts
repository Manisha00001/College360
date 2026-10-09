import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Location {
  id: number;
  name: string;
  imagePath: string;
  description: string;
  floor: number;
}

export interface Navigation {
  id: number;
  fromLocationId: number;
  toLocationId: number;
  pitch: number;
  yaw: number;
  entryYaw: number;
  direction: string;
}

@Injectable({
  providedIn: 'root'
})
export class College360 {

  private apiUrl = 'http://localhost:5214/api';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(
      `${this.apiUrl}/locations`
    );
  }

  getNavigations(): Observable<Navigation[]> {
    return this.http.get<Navigation[]>(
      `${this.apiUrl}/navigations`
    );
  }
}