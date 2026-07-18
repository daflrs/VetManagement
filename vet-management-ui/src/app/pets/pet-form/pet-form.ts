import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { PageLayout } from '../../common/page-layout/page-layout';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageLayout],
  templateUrl: './pet-form.html',
  styleUrl: './pet-form.css',
})
export class PetForm {

  form: any;
  loading: boolean = false;
  owners: any[] = []
  petId: number | null = null
  preselectedOwnerId: number | null = null

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      birthDate: ['', Validators.required],
      weight: [0, Validators.required],
      ownerId: ['']
    });

    this.loadOwners();

    const ownerId = this.route.snapshot.queryParamMap.get('ownerId');

    if (ownerId) {
      this.preselectedOwnerId = +ownerId;
      this.form.patchValue({
        ownerId: this.preselectedOwnerId
      });
    }

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.petId = +id;
      this.loadPet(this.petId);
    }
  }

  loadPet(id: number): void {
    this.petService.getPet(id).subscribe({
      next: (pet: any) => {
        this.form.patchValue(({
          ...pet,
          birthDate: pet.birthDate.split('T')[0]
        }));
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
      }
    });
  }

  loadOwners(): void {
    this.petService.getOwners().subscribe({
      next: (data) => {
        this.owners = data;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.error(err);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const dto = {
      ...this.form.value,
      ownerId: this.form.value.ownerId
        ? Number(this.form.value.ownerId)
        : null
    }

    if (this.petId) {
      // Update
      this.petService.updatePet(this.petId, dto).subscribe({
        next: () => {
          this.toastService.success(`Pet ${dto.name} updated successfully!`);
          this.router.navigate(['/pets']);
        },
        error: (err) => {
        this.toastService.error(err.error.message);
          console.log(err);
          this.loading = false;
        }
      });
    } else {
      // Create
      this.petService.createPet(dto).subscribe({
        next: () => {
          this.toastService.success(`Pet ${dto.name} created successfully!`);
          this.form.reset();
          this.form.patchValue({ ownerId: '' });
          this.loading = false;
          this.router.navigate(['/pets']);
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
    return this.petId !== null;
  }

  get ownerIsPreselected(): boolean {
    return this.preselectedOwnerId !== null
      && Number(this.form.value.ownerId) === this.preselectedOwnerId;
  }
}
