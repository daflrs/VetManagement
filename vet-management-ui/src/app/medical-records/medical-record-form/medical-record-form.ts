import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicalRecordService } from '../../services/medical-record.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BackButton } from '../../common/back-button/back-button';
import { ConfirmModal } from '../../common/confirm-modal/confirm-modal';

@Component({
  selector: 'app-medical-record-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButton, ConfirmModal],
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
      symptoms: ['', Validators.required],
      diagnosis: ['', Validators.required],
      treatment: ['', Validators.required],
      weight: [0, Validators.required],
      notes: ['']
    });

    this.loadAppointments();
    this.loadPets();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.medicalRecordId = +id;
      this.loadMedicalRecord(this.medicalRecordId);
    }

    const appointmentId = this.route.snapshot.queryParamMap.get('appointmentId');

    if (appointmentId) {
      this.form.patchValue({
        appointmentId: +appointmentId
      });
    }
  }

  loadMedicalRecord(id: number): void {
    this.form.get('appointmentId')?.disable();
    
    this.medicalRecordService.getMedicalRecord(id).subscribe({
      next: (medicalRecord: any) => {
        this.form.patchValue(({
          ...medicalRecord,
          visitDate: medicalRecord.visitDate.split('T')[0]
        }));
      },
      error: (err) => {
        console.log(err);
      }
    });
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
    
    if (this.medicalRecordId) {
      // Update
      this.medicalRecordService.updateMedicalRecord(this.medicalRecordId, this.form.value).subscribe({
        next: () => {
          this.toastService.success(`Medical record updated successfully!`);
          this.router.navigate(['/medical-records']);
        },
        error: (err) => {
          this.toastService.error(err.error.message);
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      // Create
      this.createMedicalRecord();
    }
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

  get isEditMode(): boolean {
    return this.medicalRecordId !== null;
  }

  createWithoutAppointment(): void {
    this.showCreateWithoutAppointmentModal = false;
    this.createMedicalRecord();
  }

  cancelCreateWithoutAppointment() {
    this.showCreateWithoutAppointmentModal = false;
  }
}
