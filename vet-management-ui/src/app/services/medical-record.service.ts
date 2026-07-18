import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalRecord } from '../models/medical-record';
import { MedicalRecordDetailsDto } from '../models/medical-record.details';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordService {
  
  private apiUrlMedicalRecords = `${environment.apiUrl}medicalrecords`;
  private apiUrlAppointments = `${environment.apiUrl}appointments`;
  private apiUrlPets = `${environment.apiUrl}pets`;

  constructor(private http: HttpClient) {}

  getMedicalRecords(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(this.apiUrlMedicalRecords);
  }
  
  getMedicalRecord(id: number) {
    return this.http.get(`${this.apiUrlMedicalRecords}/${id}`);
  }
  
  getMedicalRecordDetails(id: number): Observable<MedicalRecordDetailsDto> {
    return this.http.get<MedicalRecordDetailsDto>(`${this.apiUrlMedicalRecords}/details/${id}`);
  }
  
  getAvailableAppointments() {
    return this.http.get<any>(`${this.apiUrlAppointments}/available-for-medical-record`);
  }

  getPets() {
    return this.http.get<any>(this.apiUrlPets);
  }

  createMedicalRecord(medicalRecord: any): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(this.apiUrlMedicalRecords, medicalRecord);
  }
  
  updateMedicalRecord(id: number, medicalRecord: any) {
    return this.http.put(`${this.apiUrlMedicalRecords}/${id}`, medicalRecord);
  }

  deleteMedicalRecord(id: number) {
    return this.http.delete(`${this.apiUrlMedicalRecords}/${id}`);
  }
}
