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
import { environment } from '../../../environments/environment';
import { LabExamFindingComponent } from '../../common/lab-exam-finding/lab-exam-finding';
import { LabExamFindingForm } from '../../models/labExamFindingForm';

@Component({
  selector: 'app-medical-record-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppointmentTypePipe, AppointmentStatusBadge, PageLayout, LabExamFindingComponent],
  templateUrl: './medical-record-details.html',
  styleUrl: './medical-record-details.css',
})
export class MedicalRecordDetails {

  baseUrl: string = environment.baseUrl;
  medicalRecordForm: any;
  labExamForm: any;
  medicalRecordId: number | null = null;
  labExamFindingId: number | null = null;
  medicalRecordDetails: any;
  loadingState: 'loading' | 'loaded' | 'error' = 'loading';
  isSavingMedicalRecord: boolean = false;
  isLoadingMedicalRecord: boolean = false;
  isSavingLabExam: boolean = false;
  isLoadingLabExam: boolean = false;
  isSavingLabExamFinding: boolean = false;
  isLoadingLabExamFinding: boolean = false;
  isLabExamInputVisible: boolean = false;
  isFindingInputVisible: boolean = false;
  imagePreview: any;
  selectedFileName: string | null = null;

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

    this.labExamForm = this.fb.group({
      interpretation: [null]
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
  
  showLabExamFindingInput(): void {
    this.isFindingInputVisible = true;
  }

  deleteLabExamFinding(findingId: number): void {
    this.isSavingLabExamFinding = true;

    this.medicalRecordService.deleteLabExamFinding(Number(this.medicalRecordId), findingId).subscribe({
      next: (data) => {
        this.toastService.success(`Lab examination finding deleted successfully!`);
        this.medicalRecordDetails = data;
        this.isSavingLabExamFinding = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSavingLabExamFinding = false;
      }
    });
  }

  updateLabExamFinding(dto: LabExamFindingForm, findingId: number): void {
    this.isSavingLabExamFinding = true;

    const formData = new FormData();

    if (dto.image) {
      formData.append("image", dto.image);
    }

    if (dto.remark) {
      formData.append("remark", dto.remark ?? "");
    }

    if (dto.removeImage) {
      formData.append("removeImage", String(dto.removeImage));
    }

    this.medicalRecordService.updateLabExamFinding(Number(this.medicalRecordId), formData, findingId).subscribe({
      next: (data) => {
        this.toastService.success(`Lab examination finding created successfully!`);
        this.medicalRecordDetails = data;
        this.isSavingLabExamFinding = false;
        this.isFindingInputVisible = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSavingLabExamFinding = false;
      }
    });
  }

  createLabExamFinding(dto: LabExamFindingForm): void {
    this.isSavingLabExamFinding = true;

    const formData = new FormData();

    if (dto.image) {
      formData.append("image", dto.image);
    }

    if (dto.remark) {
      formData.append("remark", dto.remark);
    }

    this.medicalRecordService.createLabExamFinding(Number(this.medicalRecordId), formData).subscribe({
      next: (data) => {
        this.toastService.success(`Lab examination finding created successfully!`);
        this.medicalRecordDetails = data;
        this.isSavingLabExamFinding = false;
        this.isFindingInputVisible = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSavingLabExamFinding = false;
      }
    });
  }

  showLabExamInput(): void {
    this.isLabExamInputVisible = true;
  }

  saveLabExamChanges(): void {
    if (this.labExamForm.invalid) return;

    this.isSavingLabExam = true;

    const dto = {
      ...this.labExamForm.value
    }

    if (this.medicalRecordDetails?.labExam) {
      this.updateLabExam(dto);
    }
    else {
      this.createLabExam(dto);
    }
  }
  
  updateLabExam(dto: any): void {
    this.medicalRecordService.updateLabExamination(Number(this.medicalRecordId), dto).subscribe({
      next: (data) => {
        this.toastService.success(`Lab examination updated successfully!`);
        this.medicalRecordDetails = data;
        this.labExamForm.markAsPristine();
        this.isSavingLabExam = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSavingLabExam = false;
      }
    });
  }

  createLabExam(dto: any): void {
    this.medicalRecordService.createLabExamination(Number(this.medicalRecordId), dto).subscribe({
      next: (data) => {
        this.toastService.success(`Lab examination created successfully!`);
        this.medicalRecordDetails = data;
        this.labExamForm.markAsPristine();
        this.isSavingLabExam = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSavingLabExam = false;
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
