import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PageLayout } from '../../common/page-layout/page-layout';
import { MedicationService } from '../../services/medication.service';
import { ToastService } from '../../services/toast.service';
import { Medication } from '../../models/medication';

@Component({
  selector: 'app-medication-list',
  imports: [CommonModule, FormsModule, RouterLink, PageLayout],
  templateUrl: './medication-list.html',
  styleUrl: './medication-list.css',
})
export class MedicationList {

  loadingState: 'loading' | 'loaded' | 'empty' | 'error' = 'loading';
  medications: Medication[] = [];
  searchTerm: string = '';

  constructor(
    private medicationService: MedicationService,
    private toastService: ToastService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadMedications();
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

  loadMedications(): void {
    this.loadingState = 'loading';

    this.medicationService.getMedications().subscribe({
      next: (data) => {
        this.medications = data;
        this.loadingState = this.medications.length ? 'loaded' : 'empty';
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.error(err);
        this.loadingState = 'error';
      }
    });
  }

  deleteMedication(event: MouseEvent, id: number): void {
    event?.stopPropagation();

    if (!confirm('Are you sure you want to delete this medication?')) return;

    this.medicationService.deleteMedication(id).subscribe({
      next: (data) =>{
        this.toastService.success('Medication deletion success.');
        this.loadMedications();
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
      }
    });
  }
  
  viewMedication(id: number): void {
    this.router.navigate(['products/medications/details', id]);
  }
}
