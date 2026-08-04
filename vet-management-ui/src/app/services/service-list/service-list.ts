import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PageLayout } from '../../common/page-layout/page-layout';
import { Service } from '../../models/service';
import { ServiceService } from '../service.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-service-list',
  imports: [CommonModule, FormsModule, RouterLink, PageLayout],
  templateUrl: './service-list.html',
  styleUrl: './service-list.css',
})
export class ServiceList {
  
  loadingState: 'loading' | 'loaded' | 'empty' | 'error' = 'loading';
  services: Service[] = [];
  searchTerm: string = '';

  constructor(
    private serviceService: ServiceService,
    private toastService: ToastService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadServices();
  }

  // search(): void {
  //   if (!this.searchTerm) {
  //     this.loadMedications();
  //     return;
  //   }

  //   this.loadingState = 'loading';
    
  //   this.medicationService.searchMedications(this.searchTerm).subscribe({
  //     next: (data) => {
  //       this.medications = data;
  //       this.loadingState = 'loaded';
  //     },
  //     error: (err) => {
  //       this.toastService.error(err.error.message);
  //       console.error(err);
  //       this.loadingState = 'error';
  //     }
  //   });
  // }

  // resetSearch(): void{
  //   this.searchTerm = '';
  //   this.loadMedications();
  // }

  loadServices(): void {
    this.loadingState = 'loading';

    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services = data;
        this.loadingState = this.services.length ? 'loaded' : 'empty';
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.error(err);
        this.loadingState = 'error';
      }
    });
  }

  deleteService(event: MouseEvent, id: number): void {
    event?.stopPropagation();

    if (!confirm('Are you sure you want to delete this service?')) return;

    this.serviceService.deleteService(id).subscribe({
      next: (data) =>{
        this.toastService.success('Service deletion success.');
        this.loadServices();
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
      }
    });
  }
  
  viewService(id: number): void {
    this.router.navigate(['products/services/details', id]);
  }
}
