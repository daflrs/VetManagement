import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {

  open = input(false);
  large = input(false);
  title = input('A Modal');
  affirmText = input('Yes');
  cancelText = input('Cancel');
  affirmButtonClass = input('btn-primary');
  isLoading = input(false);
  affirmed = output<void>();
  cancelled = output<void>();

  onAffirm(): void {
    this.affirmed.emit();
  }
  
  onCancel(): void {
    this.cancelled.emit();
  }}
