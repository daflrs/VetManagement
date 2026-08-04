import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Service } from '../models/service';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {

  private apiUrlServices = `${environment.apiUrl}services`;

  constructor(private http: HttpClient) {}

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrlServices);
  }
  
  getService(id: number) {
    return this.http.get(`${this.apiUrlServices}/${id}`);
  }
  
  createService(service: any): Observable<Service> {
    return this.http.post<Service>(this.apiUrlServices, service);
  }
  
  updateService(id: number, service: any) {
    return this.http.put(`${this.apiUrlServices}/${id}`, service);
  }

  deleteService(id: number) {
    return this.http.delete(`${this.apiUrlServices}/${id}`);
  }}
