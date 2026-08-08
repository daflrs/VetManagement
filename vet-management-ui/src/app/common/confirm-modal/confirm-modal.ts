import { Component, input, output } from '@angular/core';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [Modal],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModal {

  open = input(false);
  title = input('Confirmation');
  message = input('');
  confirmText = input('Confirm');
  cancelText = input('Cancel');
  confirmButtonClass = input('btn-primary');
  isLoading = input(false);
  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }
  
  onCancel(): void {
    this.cancelled.emit();
  }
}
