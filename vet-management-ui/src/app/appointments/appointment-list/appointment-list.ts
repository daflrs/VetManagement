import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment';
import { ToastService } from '../../services/toast.service';
import { Router, RouterLink } from '@angular/router';
import { AppointmentStatus } from '../../models/appointment-status';
import { AppointmentTypePipe } from '../../common/pipes/appointment-type.pipe.ts/appointment-type.pipe.ts';
import { AppointmentStatusBadge } from '../../common/appointment-status-badge/appointment-status-badge';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AppointmentTypePipe, AppointmentStatusBadge],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.css',
})
export class AppointmentList {
  
  protected readonly AppointmentStatus = AppointmentStatus;

  loadingState: 'loading' | 'loaded' | 'empty' | 'error' = 'loading';
  appointments: Appointment[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loadingState = 'loading';

    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        console.log(data)
        this.appointments = data;
        this.loadingState = this.appointments.length ? 'loaded' : 'empty';
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.error(err);
        this.loadingState = 'error';
      }
    });
  }

  editAppointment(event: MouseEvent, id: number): void {
    event?.stopPropagation();
    this.router.navigate(['/appointments/edit', id]);
  }

  deleteAppointment(event: MouseEvent, id: number): void {
    event?.stopPropagation();

    if (!confirm('Are you sure you want to delete this appointment record?')) return;

    this.appointmentService.deleteAppointment(id).subscribe({
      next: (data) => {
        this.toastService.success('Appointment deleted successfully');
        this.loadAppointments();
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.error(err);
      }
    });
  }
  
  viewAppointmentDetails(id: number): void {
    this.router.navigate(['appointments/details', id]);
  }

  viewMedicalRecordDetails(id: number): void {
    this.router.navigate(['medical-records/details', id]);
  }

  createMedicalRecordDetails(id: number): void {
    this.router.navigate(
      ['create-medical-record'],
      { queryParams: { appointmentId: id } }
    );
  }
}
