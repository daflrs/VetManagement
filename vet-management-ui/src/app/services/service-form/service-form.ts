import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { ToastService } from '../toast.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageLayout } from '../../common/page-layout/page-layout';

@Component({
  selector: 'app-service-form',
  imports: [CommonModule, ReactiveFormsModule, PageLayout],
  templateUrl: './service-form.html',
  styleUrl: './service-form.css',
})
export class ServiceForm {

  form: any;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private toastService: ToastService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const dto = {
      ...this.form.value
    }

    this.serviceService.createService(dto).subscribe({
      next: () => {
        this.toastService.success(`Service ${dto.name} created successfully!`);
        this.form.reset();
        this.loading = false;
        this.router.navigate(['products/services']);
      },
      error: (err) => {
      this.toastService.error(err.error.message);
        console.error(err);
        this.loading = false;
      }
    });
  }}
