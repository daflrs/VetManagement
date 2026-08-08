import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Treatment } from '../models/treatment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class TreatmentService {
  
  private apiUrlTreatments = `${environment.apiUrl}treatments`;

  constructor(private http: HttpClient) {}

  createTreatment(id: number, treatment: any): Observable<Treatment> {
    return this.http.post<Treatment>(`${this.apiUrlTreatments}/${id}`, treatment);
  }
  
  updateTreatment(id: number, treatment: any): Observable<Treatment> {
    return this.http.put<Treatment>(`${this.apiUrlTreatments}/${id}`, treatment);
  }

  createTreatmentItems(id: number, treatmentItems: any): Observable<Treatment> {
    return this.http.post<Treatment>(`${this.apiUrlTreatments}/${id}/treatment-items`, treatmentItems);
  }

  updateTreatmentItems(id: number, treatmentItems: any): Observable<Treatment> {
    return this.http.put<Treatment>(`${this.apiUrlTreatments}/${id}/treatment-items`, treatmentItems);
  }

  deleteTreatmentItem(id: number, itemId: number): Observable<Treatment> {
    return this.http.delete<Treatment>(`${this.apiUrlTreatments}/${id}/treatment-items/${itemId}`);
  }
}
