import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MedicalRecordService } from '../../services/medical-record.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentTypePipe } from '../../common/pipes/appointment-type.pipe.ts/appointment-type.pipe.ts';
import { AppointmentStatusBadge } from '../../common/appointment-status-badge/appointment-status-badge';
import { PageLayout } from '../../common/page-layout/page-layout';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Helpers } from '../../common/helpers';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-medical-record-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppointmentTypePipe, AppointmentStatusBadge, PageLayout],
  templateUrl: './medical-record-details.html',
  styleUrl: './medical-record-details.css',
})
export class MedicalRecordDetails {

  medicalRecordForm: any;
  medicalRecordId: number | null = null;
  medicalRecordDetails: any;
  loadingState: 'loading' | 'loaded' | 'error' = 'loading';
  isSavingMedicalRecord: boolean = false;
  isLoadingMedicalRecord: boolean = false;

  constructor(
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.medicalRecordForm = this.fb.group({
      visitDate: ['', Validators.required],
      complaint: ['', Validators.required],
      diagnosis: ['', Validators.required],
      treatment: ['', Validators.required],
      weight: [0, Validators.required],
      clinicalExam: [''],
      clientCommunication: [''],
      notes: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.medicalRecordId = +id;
      this.loadMedicalRecordDetails(this.medicalRecordId);
    }
  }

  loadMedicalRecordDetails(id: number): void {
    this.loadingState = 'loading';

    this.medicalRecordService.getMedicalRecordDetails(id).subscribe({
      next: (data) => {
        this.medicalRecordDetails = data;
        this.medicalRecordForm.patchValue({
          visitDate: Helpers.formatDateForInput(this.medicalRecordDetails.visitDate),
          complaint: this.medicalRecordDetails.complaint,
          diagnosis: this.medicalRecordDetails.diagnosis,
          treatment: this.medicalRecordDetails.treatment,
          weight: this.medicalRecordDetails.weight,
          clinicalExam: this.medicalRecordDetails.clinicalExam,
          clientCommunication: this.medicalRecordDetails.clientCommunication,
          petId: this.medicalRecordDetails.petId
        });
        this.loadingState = 'loaded';
      },
      error: (err) => {
        console.log(err);
        this.loadingState = 'error';
      }
    });
  }
  
  saveEditChanges(): void {
    if (this.medicalRecordForm.invalid) return;

    this.isSavingMedicalRecord = true;

    const dto = {
      ...this.medicalRecordForm.value
    }

    this.medicalRecordService.updateMedicalRecord(Number(this.medicalRecordId), dto).subscribe({
      next: (data) => {
        this.toastService.success(`Medical record of ${this.medicalRecordDetails.pet.name} updated successfully!`);
        this.medicalRecordDetails = data;
        this.medicalRecordForm.markAsPristine();
        this.isSavingMedicalRecord = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSavingMedicalRecord = false;
      }
    });
  }

  viewAppointmentDetails(id: number): void {
    this.router.navigate(['appointments/details', id]);
  }

  viewOwnerDetails(id: number): void {
    this.router.navigate(['owners/details', id]);
  }
  
  viewPetDetails(id: number): void {
    this.router.navigate(['pets/details', id]);
  }
}
