import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Medication } from '../models/medication';

@Injectable({
  providedIn: 'root',
})
export class MedicationService {

  private apiUrlMedications = `${environment.apiUrl}medications`;

  constructor(private http: HttpClient) {}

  getMedications(): Observable<Medication[]> {
    return this.http.get<Medication[]>(this.apiUrlMedications);
  }
  
  getMedication(id: number) {
    return this.http.get(`${this.apiUrlMedications}/${id}`);
  }
  
  createMedication(medication: any): Observable<Medication> {
    return this.http.post<Medication>(this.apiUrlMedications, medication);
  }
  
  updateMedication(id: number, medication: any) {
    return this.http.put(`${this.apiUrlMedications}/${id}`, medication);
  }

  deleteMedication(id: number) {
    return this.http.delete(`${this.apiUrlMedications}/${id}`);
  }
}
