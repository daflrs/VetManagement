import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerService } from '../../services/owner.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { BackButton } from '../../common/back-button/back-button';

@Component({
  selector: 'app-owner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButton],
  templateUrl: './owner-form.html',
  styleUrl: './owner-form.css',
})
export class OwnerForm {

  form: any;
  loading: boolean = false;
  ownerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private ownerService: OwnerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.ownerId = +id;
      this.loadOwner(this.ownerId);
    }
  }

  loadOwner(id: number): void {
    this.ownerService.getOwner(id).subscribe({
      next: (owner: any) => {
        this.form.patchValue(owner);
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    if (this.ownerId) {
      // Update
      this.ownerService.updateOwner(this.ownerId, this.form.value).subscribe({
        next: () => {
          let name = `${this.form.value.firstName} ${this.form.value.lastName}`
          this.toastService.success(`Owner ${name} updated successfully!`);
          this.router.navigate(['/owners']);
        },
        error: (err) => {
        this.toastService.addToast({ message: err.error.message, type: 'error' });
          console.log(err);
          this.loading = false;
        }
      });
    } else {
      // Create
      this.ownerService.createOwner(this.form.value).subscribe({
        next: (data) => {
          let name = `${this.form.value.firstName} ${this.form.value.lastName}`
          this.toastService.success(`Owner ${name} created successfully!`);
          this.form.reset();
          this.router.navigate(['/owners']);
          this.loading = false;
        },
        error: (err) => {
          this.toastService.error(err.error.message);
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  get isEditMode(): boolean {
    return this.ownerId !== null;
  }
}
