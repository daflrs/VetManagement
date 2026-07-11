import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MedicalRecordService } from '../../services/medical-record.service';
import { BackButton } from '../../common/back-button/back-button';
import { ActivatedRoute } from '@angular/router';
import { AppointmentTypePipe } from '../../common/pipes/appointment-type.pipe.ts/appointment-type.pipe.ts';
import { AppointmentStatusBadge } from '../../common/appointment-status-badge/appointment-status-badge';

@Component({
  selector: 'app-medical-record-details',
  standalone: true,
  imports: [CommonModule, BackButton, AppointmentTypePipe, AppointmentStatusBadge],
  templateUrl: './medical-record-details.html',
  styleUrl: './medical-record-details.css',
})
export class MedicalRecordDetails {

  medicalRecordId: number | null = null;
  medicalRecordDetails: any;
  loadingState: 'loading' | 'loaded' | 'error' = 'loading';

  constructor(
    private medicalRecordService: MedicalRecordService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
        this.loadingState = 'loaded';
      },
      error: (err) => {
        console.log(err);
        this.loadingState = 'error';
      }
    });
  }
}
