import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicalRecordService } from '../../services/medical-record.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmModal } from '../../common/confirm-modal/confirm-modal';
import { PageLayout } from '../../common/page-layout/page-layout';

@Component({
  selector: 'app-medical-record-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmModal, PageLayout],
  templateUrl: './medical-record-form.html',
  styleUrl: './medical-record-form.css',
})
export class MedicalRecordForm {

  form: any;
  isLoading: boolean = false;
  appointments: any[] = [];
  pets: any[] = [];
  medicalRecordId: number | null = null;
  showCreateWithoutAppointmentModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      appointmentId: [null],
      petId: ['', Validators.required],
      visitDate: ['', Validators.required],
      complaint: ['', Validators.required],
      diagnosis: ['', Validators.required],
      treatment: ['', Validators.required],
      weight: [0, Validators.required],
      notes: ['']
    });

    this.loadAppointments();
    this.loadPets();

    const appointmentId = this.route.snapshot.queryParamMap.get('appointmentId');

    if (appointmentId) {
      this.form.patchValue({
        appointmentId: +appointmentId
      });
    }
  }

  loadAppointments(): void {
    this.medicalRecordService.getAvailableAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadPets(): void {
    this.medicalRecordService.getPets().subscribe({
      next: (data) => {
        this.pets = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    if (!this.form.value.appointmentId) {
      this.showCreateWithoutAppointmentModal = true;
      return;
    }
    
    this.isLoading = true;
    
    this.createMedicalRecord();
  }

  createMedicalRecord(): void {
      this.isLoading = true;

      this.medicalRecordService.createMedicalRecord(this.form.value).subscribe({
        next: (data) => {
          this.toastService.success(`Medical record created successfully!`);
          this.form.reset();
          this.form.patchValue({ appointmentId: '' });
          this.isLoading = false;
          this.router.navigate(['medical-records/details', data.medicalRecordId]);
        },
        error: (err) => {
          this.toastService.error(err.error.message);
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  createWithoutAppointment(): void {
    this.showCreateWithoutAppointmentModal = false;
    this.createMedicalRecord();
  }

  cancelCreateWithoutAppointment() {
    this.showCreateWithoutAppointmentModal = false;
  }
}
