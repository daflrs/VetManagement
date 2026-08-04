import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageLayout } from '../common/page-layout/page-layout';
import { Router } from '@angular/router';
import { MedicationService } from '../services/medication.service';
import { ToastService } from '../services/toast.service';
import { ServiceService } from '../services/service.service';
import { LoadingSpinner } from '../common/loading-spinner/loading-spinner';

@Component({
  selector: 'app-product',
  imports: [CommonModule, PageLayout, LoadingSpinner],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {

  isLoading: boolean = false;
  medicationCount: number | null = null;
  serviceCount: number | null = null;

  constructor(
    private serviceService: ServiceService,
    private medicationService: MedicationService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMedicationsCount();
    this.getServicesCount();
  }

  getMedicationsCount(): void {
    this.isLoading = true;

    this.medicationService.getMedications().subscribe({
      next: (data) =>{
        this.medicationCount = data.length;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  viewMedications(): void {
    this.router.navigate(['products/medications']);
  }
  
  getServicesCount(): void {
    this.isLoading = true;

    this.serviceService.getServices().subscribe({
      next: (data) =>{
        console.log(data)
        this.serviceCount = data.length;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  viewServices(): void {
    this.router.navigate(['products/services']);
  }
}
