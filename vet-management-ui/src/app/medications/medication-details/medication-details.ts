import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageLayout } from '../../common/page-layout/page-layout';
import { LoadingSpinner } from '../../common/loading-spinner/loading-spinner';
import { ToastService } from '../../services/toast.service';
import { MedicationService } from '../../services/medication.service';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../common/helpers';

@Component({
  selector: 'app-medication-details',
  imports: [CommonModule, ReactiveFormsModule, PageLayout, LoadingSpinner],
  templateUrl: './medication-details.html',
  styleUrl: './medication-details.css',
})
export class MedicationDetails {

  form: any;
  medicationId: number | null = null;
  isLoading: boolean = false;
  isSaving: boolean = false;
  medicationDetails: any;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private medicationService: MedicationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      availableCount: [0, Validators.required],
      manufacturer: [''],
      expirationDate: [null]
    });
    
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.medicationId = +id;
      this.loadMedication(this.medicationId);
    }
  }

  loadMedication(id: number): void {
    this.isLoading = true;

    this.medicationService.getMedication(id).subscribe({
      next: (data) => {
        this.medicationDetails = data;
        this.form.patchValue({
          name: this.medicationDetails.name,
          price: this.medicationDetails.price,
          availableCount: this.medicationDetails.availableCount,
          manufacturer: this.medicationDetails.manufacturer,
          birthDate: Helpers.formatDateForInput(this.medicationDetails.expirationDate),
        });

        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isLoading = false;
      }
    });
  }
  
  saveEditChanges(): void {
    if (this.form.invalid) return;

    this.isSaving = true;

    const dto = {
      ...this.form.value
    }

    this.medicationService.updateMedication(Number(this.medicationId), dto).subscribe({
      next: (data) => {
        this.toastService.success(`Medication "${dto.name}" updated successfully!`);
        this.medicationDetails = data;
        this.form.markAsPristine();
        this.isSaving = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSaving = false;
      }
    });
  }
}
