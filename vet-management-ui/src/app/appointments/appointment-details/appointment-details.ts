import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentTypePipe } from '../../common/pipes/appointment-type.pipe.ts/appointment-type.pipe.ts';
import { AppointmentStatus } from '../../models/appointment-status';
import { AppointmentStatusBadge } from '../../common/appointment-status-badge/appointment-status-badge';
import { AppointmentWorkflowAction } from '../../models/appointment-workflow-action';
import { LoadingSpinner } from '../../common/loading-spinner/loading-spinner';
import { PageLayout } from '../../common/page-layout/page-layout';

@Component({
  selector: 'app-appointment-details',
  imports: [CommonModule, AppointmentTypePipe, AppointmentStatusBadge, LoadingSpinner, PageLayout],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.css',
})
export class AppointmentDetails {

  protected readonly AppointmentStatus = AppointmentStatus;
  appointmentId: number | null = null;
  isLoading: boolean = false;
  processingAction: AppointmentWorkflowAction | null = null
  appointmentDetails: any;

  constructor(
    private toastService: ToastService,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.appointmentId = +id;
      this.loadAppointment(this.appointmentId);
    }
  }

  loadAppointment(id: number): void {
    this.isLoading = true;

    this.appointmentService.getAppointmentDetails(id).subscribe({
      next: (data) => {
        this.appointmentDetails = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  checkInAppointment(id: number): void {
    this.isLoading = true;
    this.processingAction = 'checkIn';
    
    this.appointmentService.checkInAppointment(id).subscribe({
      next: (data) => {
        this.appointmentDetails = data;
        this.isLoading = false;
        this.processingAction = null;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isLoading = false;
        this.processingAction = null;
      }
    });
  }
  
  cancelAppointment(id: number): void {
    this.isLoading = true;
    this.processingAction = 'cancel';
    
    this.appointmentService.cancelAppointment(id).subscribe({
      next: (data) => {
        this.appointmentDetails = data;
        this.isLoading = false;
        this.processingAction = null;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isLoading = false;
        this.processingAction = null;
      }
    });
  }
  
  noShowAppointment(id: number): void {
    this.isLoading = true;
    this.processingAction = 'noShow';
    
    this.appointmentService.noShowAppointment(id).subscribe({
      next: (data) => {
        this.appointmentDetails = data;
        this.isLoading = false;
        this.processingAction = null;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isLoading = false;
        this.processingAction = null;
      }
    });
  }
  
  completeAppointment(id: number): void {
    this.isLoading = true;
    this.processingAction = 'complete';
    
    this.appointmentService.completeAppointment(id).subscribe({
      next: (data) => {
        this.appointmentDetails = data;
        this.isLoading = false;
        this.processingAction = null;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isLoading = false;
        this.processingAction = null;
      }
    });
  }

  viewOwnerDetails(id: number): void {
    this.router.navigate(['owners/details', id]);
  }
  
  viewPetDetails(id: number): void {
    this.router.navigate(['pets/details', id]);
  }
}
