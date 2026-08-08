import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MedicalRecordService } from '../../services/medical-record.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentTypePipe } from '../../common/pipes/appointment-type.pipe.ts/appointment-type.pipe.ts';
import { AppointmentStatusBadge } from '../../common/appointment-status-badge/appointment-status-badge';
import { PageLayout } from '../../common/page-layout/page-layout';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Helpers } from '../../common/helpers';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';
import { LabExamFindingComponent } from '../../common/lab-exam-finding/lab-exam-finding';
import { LabExamFindingForm } from '../../models/labExamFindingForm';
import { TreatmentService } from '../../services/treatment.service';
import { TreatmentItemType } from '../../models/treatmentItemType';
import { Modal } from '../../common/modal/modal';
import { Medication } from '../../models/medication';
import { Service } from '../../models/service';
import { MedicationService } from '../../services/medication.service';
import { ServiceService } from '../../services/service.service';
import { LoadingSpinner } from '../../common/loading-spinner/loading-spinner';
import { SelectedTreatmentItem } from '../../models/selectedTreatmentItem';
import { MedicalRecordDetailsDto } from '../../models/medical-record.details';

@Component({
  selector: 'app-medical-record-details',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    AppointmentTypePipe, 
    AppointmentStatusBadge, 
    PageLayout, 
    LabExamFindingComponent, 
    Modal, 
    LoadingSpinner],
  templateUrl: './medical-record-details.html',
  styleUrl: './medical-record-details.css',
})
export class MedicalRecordDetails {

  baseUrl: string = environment.baseUrl;

  medicalRecordForm!: FormGroup;
  labExamForm!: FormGroup;
  treatmentForm!: FormGroup;
  treatmentItemsForm!: FormGroup;

  medicalRecordId: number | null = null;
  labExamFindingId: number | null = null;

  medicalRecordDetails: MedicalRecordDetailsDto | null = null;
  medications: Medication[] = [];
  services: Service[] = [];
  selectedTreatmentItemType: TreatmentItemType = 'medication';

  modalSelectedTreatmentItems: SelectedTreatmentItem[] = [];

  loadingState: 'loading' | 'loaded' | 'error' = 'loading';

  isSavingMedicalRecord: boolean = false;
  isLoadingMedicalRecord: boolean = false;

  isSavingLabExam: boolean = false;
  isLoadingLabExam: boolean = false;
  isLabExamInputVisible: boolean = false;

  isSavingTreatment: boolean = false;
  isLoadingTreatment: boolean = false;
  isTreatmentInputVisible: boolean = false;

  isSavingTreatmentItem: boolean = false;
  isLoadingTreatmentItem: boolean = false;
  
  isSelectTreatmentItemModalVisible: boolean = false;

  isSavingLabExamFinding: boolean = false;
  isLoadingLabExamFinding: boolean = false;
  isFindingInputVisible: boolean = false;
  
  selectedFileName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private treatmentService: TreatmentService,
    private medicationService: MedicationService,
    private serviceService: ServiceService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.medicalRecordForm = this.fb.group({
      visitDate: ['', Validators.required],
      complaint: ['', Validators.required],
      diagnosis: ['', Validators.required],
      weight: [0, Validators.required],
      clinicalExam: [''],
      clientCommunication: [''],
      notes: ['']
    });

    this.labExamForm = this.fb.group({
      interpretation: [null]
    });

    this.treatmentForm = this.fb.group({
      others: [null]
    });

    this.treatmentItemsForm = this.fb.group({
      existingItems: this.fb.array([]),
      pendingItems: this.fb.array([])
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
          weight: this.medicalRecordDetails.weight,
          clinicalExam: this.medicalRecordDetails.clinicalExam,
          clientCommunication: this.medicalRecordDetails.clientCommunication,
          petId: this.medicalRecordDetails.pet.petId
        });

        if (this.medicalRecordDetails.labExam) {
          this.labExamForm.patchValue({
            interpretation: this.medicalRecordDetails.labExam.interpretation
          });
        }

        if (this.medicalRecordDetails.treatment) {
          this.treatmentForm.patchValue({
            others: this.medicalRecordDetails.treatment.others
          });

          this.populateTreatmentItemsForm();
        }

        this.loadingState = 'loaded';
      },
      error: (err) => {
        console.log(err);
        this.loadingState = 'error';
      }
    });
  }
  
  // Lab Exam Finding

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

  // Lab Exam

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

  // Treatment

  updateTreatment(dto: any): void {
      this.treatmentService.updateTreatment(Number(this.medicalRecordId), dto).subscribe({
      next: (data) => {
        this.toastService.success(`Treatment updated successfully!`);
        this.medicalRecordDetails!.treatment = data;
        this.treatmentForm.markAsPristine();
        this.isSavingTreatment = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSavingTreatment = false;
      }
    });
  }

  createTreatment(dto: any): void {
    this.treatmentService.createTreatment(Number(this.medicalRecordId), dto).subscribe({
      next: (data) => {
        this.toastService.success(`Treatment created successfully!`);
        this.medicalRecordDetails!.treatment = data;
        this.treatmentForm.markAsPristine();
        this.isSavingTreatment = false;
      },
      error: (err) => {
        this.toastService.error(err.error?.message ?? 'An unknown error occurred.');
        console.log(err);
        this.isSavingTreatment = false;
      }
    });
  }

  saveTreatmentChanges(): void {
    if (this.treatmentForm.invalid) return;

    this.isSavingTreatment = true;

    const dto = {
      ...this.treatmentForm.value
    }

    if (this.medicalRecordDetails?.treatment) {
      this.updateTreatment(dto);
    }
    else {
      this.createTreatment(dto);
    }
  }
  
  showTreatmentInput(): void {
    this.isTreatmentInputVisible = true;
  }

  showSelectTreatmentItemModal(type: TreatmentItemType): void {
    this.selectedTreatmentItemType = type;
    this.isSelectTreatmentItemModalVisible = true;
    
    if (type === 'medication') {
      this.loadMedications();
    }

    if (type === 'service') {
      this.loadServices();
    }
  }

  hideSelectTreatmentItemModal(): void {
    this.isSelectTreatmentItemModalVisible = false;
  }

  loadMedications(): void {
    this.isLoadingTreatmentItem = true;

    this.medicationService.getMedications().subscribe({
      next: (data) => {
        this.medications = data;
        this.isLoadingTreatmentItem = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isLoadingTreatmentItem = false;
      }
    });
  }

  loadServices(): void {
    this.isLoadingTreatmentItem = true;

    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services = data;
        this.isLoadingTreatmentItem = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isLoadingTreatmentItem = false;
      }
    });
  }

  onMedicationChecked(medication: Medication, checked: boolean): void {
    if (checked) {
      this.modalSelectedTreatmentItems.push({
        medicationId: medication.medicationId,
        nameAtTreatment: medication.name,
        unitPrice: medication.price,
        quantity: 0,
        reason: ''
      });
    } else {
      this.modalSelectedTreatmentItems = this.modalSelectedTreatmentItems.filter(item => item.medicationId !== medication.medicationId);
    }
  }

  onServiceChecked(service: Service, checked: boolean): void {
    if (checked) {
      this.modalSelectedTreatmentItems.push({
        serviceId: service.serviceId,
        nameAtTreatment: service.name,
        unitPrice: service.price,
        quantity: 0,
        reason: ''
      });
    } else {
      this.modalSelectedTreatmentItems = this.modalSelectedTreatmentItems.filter(item => item.serviceId !== service.serviceId);
    }
  }

  addTreatmentItemsToTreatmentList(): void {
    const pendingItems = this.pendingTreatmentItems;

    this.modalSelectedTreatmentItems.forEach(item => {
      pendingItems.push(this.fb.group({
        medicationId: [item.medicationId],
        serviceId: [item.serviceId],
        nameAtTreatment: [item.nameAtTreatment],
        unitPrice: [item.unitPrice],
        quantity: [item.medicationId ? 1 : item.quantity, Validators.required],
        reason: [item.reason]
      }));
    });

    this.pendingTreatmentItems.markAsDirty();
    this.modalSelectedTreatmentItems = [];
    this.isSelectTreatmentItemModalVisible = false;
  }

  removeSelectedTreatmentItem(index: number): void {
    this.pendingTreatmentItems.removeAt(index);
  }

  populateTreatmentItemsForm(): void {
    const existingItems = this.existingTreatmentItems;

    existingItems.clear();

    this.medicalRecordDetails!.treatment!.treatmentItems.forEach(item => {
      existingItems.push(
        this.fb.group({
          treatmentItemId: [item.treatmentItemId],
          medicationId: [item.medication?.medicationId],
          serviceId: [item.service?.serviceId],
          nameAtTreatment: [item.nameAtTreatment],
          unitPrice: [item.unitPrice],
          quantity: [item.quantity],
          reason: [item.reason]
        })
      );
    }
    );
  }

  deleteTreatmentItem(itemId: number): void {
    this.isSavingTreatmentItem = true;
    this.treatmentItemsForm.disable();

    this.treatmentService.deleteTreatmentItem(Number(this.medicalRecordId), itemId).subscribe({
      next: (data) => {
        this.toastService.success(`Treatment items deleted successfully!`);
        this.medicalRecordDetails!.treatment = data;
        this.populateTreatmentItemsForm();
        this.isSavingTreatmentItem = false;
        this.treatmentItemsForm.enable();
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSavingTreatmentItem = false;
        this.treatmentItemsForm.enable();
      }
    });
  }

  saveTreatmentItems(): void {
    if (this.treatmentItemsForm.invalid) return;

    this.isSavingTreatmentItem = true;
    this.treatmentItemsForm.disable();

    const dto = {
      treatmentItems: this.treatmentItemsForm.value.pendingItems
    };

    this.treatmentService.createTreatmentItems(Number(this.medicalRecordId), dto).subscribe({
      next: (data) => {
        this.toastService.success(`Treatment items created successfully!`);
        this.medicalRecordDetails!.treatment = data;
        this.populateTreatmentItemsForm();

        this.pendingTreatmentItems.clear();
        this.treatmentItemsForm.markAsPristine();

        this.modalSelectedTreatmentItems = [];

        this.isSavingTreatmentItem = false;
        this.treatmentItemsForm.enable();
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSavingTreatmentItem = false;
        this.treatmentItemsForm.enable();
      }
    });
  }

  updateTreatmentItems(): void {
    if (this.treatmentItemsForm.invalid) return;

    this.isSavingTreatmentItem = true;
    this.treatmentItemsForm.disable();

    const dto = {
      treatmentItems: this.treatmentItemsForm.value.existingItems
    };

    this.treatmentService.updateTreatmentItems(Number(this.medicalRecordId), dto).subscribe({
      next: (data) => {
        this.toastService.success(`Treatment items updated successfully!`);
        this.medicalRecordDetails!.treatment = data;
        this.populateTreatmentItemsForm();

        this.pendingTreatmentItems.clear();
        this.treatmentItemsForm.markAsPristine();

        this.isSavingTreatmentItem = false;
        this.treatmentItemsForm.enable();
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSavingTreatmentItem = false;
        this.treatmentItemsForm.enable();
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
        this.toastService.success(`Medical record of ${this.medicalRecordDetails!.pet.name} updated successfully!`);
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

  get existingTreatmentItems(): FormArray {
    return this.treatmentItemsForm.get('existingItems') as FormArray;
  }
  
  get pendingTreatmentItems(): FormArray {
    return this.treatmentItemsForm.get('pendingItems') as FormArray;
  }

  private getSelectedMedicationIds(): number[] {
    return [
      ...this.existingTreatmentItems.controls
      .map(control => control.get('medicationId')?.value)
      .filter(id => id !== null && id !== undefined),

      ...this.pendingTreatmentItems.controls
      .map(control => control.get('medicationId')?.value)
      .filter(id => id !== null && id !== undefined)
    ];
  }
  
  isMedicationSelected(id: number): boolean {
    return this.getSelectedMedicationIds().includes(id);
  }

  private getSelectedServiceIds(): number[] {
    return [
      ...this.existingTreatmentItems.controls
      .map(control => control.get('serviceId')?.value)
      .filter(id => id !== null && id !== undefined),

      ...this.pendingTreatmentItems.controls
      .map(control => control.get('serviceId')?.value)
      .filter(id => id !== null && id !== undefined)
    ];
  }

  isServiceSelected(id: number): boolean {
    return this.getSelectedServiceIds().includes(id);
  }
}
