import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment';
import { AppointmentStatus } from '../../models/appointment-status';
import { AppointmentType } from '../../models/appointment-type';
import { PageLayout } from '../../common/page-layout/page-layout';

@Component({
  selector: 'app-appointment-form',
  imports: [CommonModule, ReactiveFormsModule, PageLayout],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export class AppointmentForm {

  form: any;
  loading: boolean = false;
  pets: any[] = [];
  appointmentId: number | null = null;
  statuses = Object.values(AppointmentStatus);
  types = [
    { value: AppointmentType.Scheduled, label: 'Scheduled' },
    { value: AppointmentType.WalkIn, label: 'Walk-in' },
    { value: AppointmentType.Emergency, label: 'Emergency' }
  ];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      type: ['', Validators.required],
      appointmentDate: [''],
      reason: ['', Validators.required],
      petId: ['', Validators.required]
    });

    this.loadPets();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.appointmentId = +id;
      this.loadAppointment(this.appointmentId);
    }
  }

  loadAppointment(id: number): void {
    this.appointmentService.getAppointment(id).subscribe({
      next: (appointment: Appointment) => {
        this.form.patchValue(({
          ...appointment,
          appointmentDate: appointment.appointmentDate.split('T')[0]
        }));
        
        this.onTypeChange();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  loadPets(): void {
    this.appointmentService.getPets().subscribe({
      next: (data) => {
        this.pets = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const appointment = this.form.value;
    const petName = this.pets.find(p => p.petId === Number(appointment.petId))?.name;

    if (this.appointmentId)
    {
      this.appointmentService.updateAppointment(this.appointmentId, appointment).subscribe({
        next: () => {
          this.toastService.success(`Appointment updated for ${petName} on ${appointment.appointmentDate}`);
          this.form.reset();
          this.router.navigate(['/appointments']);
          this.loading = false;
        },
        error: (err) => {
          this.toastService.error(err.error.message);
          console.log(err);
          this.loading = false;
        }
      });
    } else {
      this.appointmentService.createAppointment(appointment).subscribe({
        next: () => {
          this.toastService.success(`Appointment made for ${petName} on ${appointment.appointmentDate}`);
          this.form.reset();
          this.router.navigate(['/appointments']);
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        }
      });
    }
  }
  
  onTypeChange(): void {
    const type = this.form.get('type')?.value;
    const appointmentDateField = this.form.get('appointmentDate');

    if (type === AppointmentStatus.Scheduled) {
      appointmentDateField?.enable();
    } else {
      appointmentDateField?.disable();
    }
  }

  get isEditMode(): boolean {
    return this.appointmentId !== null;
  }
}
