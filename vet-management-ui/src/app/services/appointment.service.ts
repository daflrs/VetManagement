import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';
import { AppointmentDetailsDto } from '../models/appointment.details';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {

  private apiUrlAppointments = `${environment.apiUrl}appointments`;
  private apiUrlPets = `${environment.apiUrl}pets`;

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrlAppointments);
  }
  
  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrlAppointments}/${id}`);
  }

  getAppointmentDetails(id: number): Observable<AppointmentDetailsDto> {
    return this.http.get<AppointmentDetailsDto>(`${this.apiUrlAppointments}/details/${id}`);
  }

  createAppointment(appointment: any) {
    return this.http.post(this.apiUrlAppointments, appointment);
  }
  
  getPets() {
    return this.http.get<any>(this.apiUrlPets);
  }

  updateAppointment(id: number, appointment: any) {
    return this.http.put(`${this.apiUrlAppointments}/${id}`, appointment);
  }

  deleteAppointment(id: number) {
    return this.http.delete(`${this.apiUrlAppointments}/${id}`);
  }
  
  checkInAppointment(id: number) {
    return this.http.post<Appointment>(`${this.apiUrlAppointments}/${id}/check-in`, {});
  }
  
  cancelAppointment(id: number) {
    return this.http.post<Appointment>(`${this.apiUrlAppointments}/${id}/cancel`, {});
  }
  
  noShowAppointment(id: number) {
    return this.http.post<Appointment>(`${this.apiUrlAppointments}/${id}/no-show`, {});
  }
  
  completeAppointment(id: number) {
    return this.http.post<Appointment>(`${this.apiUrlAppointments}/${id}/complete`, {});
  }
}
