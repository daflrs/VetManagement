import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageLayout } from '../../common/page-layout/page-layout';
import { MedicationService } from '../../services/medication.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medication-form',
  imports: [CommonModule, ReactiveFormsModule, PageLayout],
  templateUrl: './medication-form.html',
  styleUrl: './medication-form.css',
})
export class MedicationForm {

  form: any;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private medicationService: MedicationService,
    private toastService: ToastService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      availableCount: [0, Validators.required],
      manufacturer: [''],
      expirationDate: [null]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const dto = {
      ...this.form.value
    }

    this.medicationService.createMedication(dto).subscribe({
      next: () => {
        this.toastService.success(`Medication ${dto.name} created successfully!`);
        this.form.reset();
        this.loading = false;
        this.router.navigate(['products/medications']);
      },
      error: (err) => {
      this.toastService.error(err.error.message);
        console.error(err);
        this.loading = false;
      }
    });
  }
}
