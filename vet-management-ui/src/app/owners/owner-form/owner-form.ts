import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerService } from '../../services/owner.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { PageLayout } from '../../common/page-layout/page-layout';

@Component({
  selector: 'app-owner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageLayout],
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
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

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
