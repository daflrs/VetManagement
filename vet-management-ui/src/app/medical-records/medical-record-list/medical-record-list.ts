import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { Router, RouterLink } from '@angular/router';
import { MedicalRecordService } from '../../services/medical-record.service';
import { MedicalRecord } from '../../models/medical-record';
import { PageLayout } from '../../common/page-layout/page-layout';

@Component({
  selector: 'app-medical-record-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PageLayout],
  templateUrl: './medical-record-list.html',
  styleUrl: './medical-record-list.css',
})
export class MedicalRecordList {

  loadingState: 'loading' | 'loaded' | 'empty' | 'error' = 'loading';
  medicalRecords: MedicalRecord[] = [];

  constructor(
    private medicalRecordService: MedicalRecordService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMedicalRecords();
  }

  loadMedicalRecords(): void {
    this.loadingState = 'loading';

    this.medicalRecordService.getMedicalRecords().subscribe({
      next: (data) => {
        this.medicalRecords = data;
        this.loadingState = this.medicalRecords.length ? 'loaded' : 'empty';
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.loadingState = 'error';
      }
    });
  }
  
  deleteMedicalRecord(event: MouseEvent, id: number): void {
    event?.stopPropagation();

    if (!confirm('Are you sure you want to delete this medical record?')) return;

    this.medicalRecordService.deleteMedicalRecord(id).subscribe({
      next: (data) => {
        this.toastService.success('Medical record successfully deleted.');
        this.loadMedicalRecords();
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
      }
    });
  }

  editMedicalRecord(event: MouseEvent, id: number): void {
    event?.stopPropagation();
    this.router.navigate(['medical-records/edit', id]);
  }

  viewMedicalRecordDetails(id: number): void {
    this.router.navigate(['medical-records/details', id]);
  }
}
