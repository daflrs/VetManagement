import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageLayout } from '../../common/page-layout/page-layout';
import { LoadingSpinner } from '../../common/loading-spinner/loading-spinner';
import { ToastService } from '../toast.service';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-service-details',
  imports: [CommonModule, ReactiveFormsModule, PageLayout, LoadingSpinner],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css',
})
export class ServiceDetails {

  form: any;
  serviceId: number | null = null;
  isLoading: boolean = false;
  isSaving: boolean = false;
  serviceDetails: any;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private serviceService: ServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.required]
    });
    
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.serviceId = +id;
      this.loadService(this.serviceId);
    }
  }

  loadService(id: number): void {
    this.isLoading = true;

    this.serviceService.getService(id).subscribe({
      next: (data) => {
        this.serviceDetails = data;
        this.form.patchValue({
          name: this.serviceDetails.name,
          price: this.serviceDetails.price
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

    this.serviceService.updateService(Number(this.serviceId), dto).subscribe({
      next: (data) => {
        this.toastService.success(`Service "${dto.name}" updated successfully!`);
        this.serviceDetails = data;
        this.form.markAsPristine();
        this.isSaving = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSaving = false;
      }
    });
  }}
