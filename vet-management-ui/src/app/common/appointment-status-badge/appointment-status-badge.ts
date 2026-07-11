import { Component, input } from '@angular/core';
import { AppointmentStatus } from '../../models/appointment-status';

@Component({
  selector: 'app-appointment-status-badge',
  imports: [],
  templateUrl: './appointment-status-badge.html',
  styleUrl: './appointment-status-badge.css',
})
export class AppointmentStatusBadge {

  status = input.required<AppointmentStatus>();

  protected readonly AppointmentStatus = AppointmentStatus;

  badgeClass(): string {
    switch (this.status()) {
      case AppointmentStatus.Scheduled:
        return 'text-bg-primary';
      case AppointmentStatus.InProgress:
        return 'text-bg-warning';
      case AppointmentStatus.Completed:
        return 'text-bg-success';
      case AppointmentStatus.Cancelled:
        return 'text-bg-danger';
      case AppointmentStatus.NoShow:
        return 'text-bg-secondary';
    }
  }
}
