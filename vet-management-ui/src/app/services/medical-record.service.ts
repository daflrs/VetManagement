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
  
  updateMedicalRecord(id: number, medicalRecord: any): Observable<MedicalRecordDetailsDto> {
    return this.http.put<MedicalRecordDetailsDto>(`${this.apiUrlMedicalRecords}/${id}`, medicalRecord);
  }

  deleteMedicalRecord(id: number) {
    return this.http.delete(`${this.apiUrlMedicalRecords}/${id}`);
  }
  
  createLabExamination(id: number, labExamination: any): Observable<MedicalRecordDetailsDto> {
    return this.http.post<MedicalRecordDetailsDto>(`${this.apiUrlMedicalRecords}/${id}/lab-examination`, labExamination);
  }
  
  updateLabExamination(id: number, labExamination: any): Observable<MedicalRecordDetailsDto> {
    return this.http.put<MedicalRecordDetailsDto>(`${this.apiUrlMedicalRecords}/${id}/lab-examination`, labExamination);
  }
  
  deleteLabExamFinding(id: number, findingId: number): Observable<MedicalRecordDetailsDto> {
    return this.http.delete<MedicalRecordDetailsDto>(`${this.apiUrlMedicalRecords}/${id}/lab-exam-finding/${findingId}`);
  }
  
  createLabExamFinding(id: number, labExamFinding: any): Observable<MedicalRecordDetailsDto> {
    return this.http.post<MedicalRecordDetailsDto>(`${this.apiUrlMedicalRecords}/${id}/lab-exam-finding`, labExamFinding);
  }
  
  updateLabExamFinding(id: number, labExamFinding: any, findingId: number): Observable<MedicalRecordDetailsDto> {
    return this.http.put<MedicalRecordDetailsDto>(`${this.apiUrlMedicalRecords}/${id}/lab-exam-finding/${findingId}`, labExamFinding);
  }
}
