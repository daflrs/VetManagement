import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { PetService } from '../../services/pet.service';
import { BackButton } from '../../common/back-button/back-button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Helpers } from '../../common/helpers';

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButton],
  templateUrl: './pet-details.html',
  styleUrl: './pet-details.css',
})
export class PetDetails {

  form: any;
  petId: number | null = null;
  petDetails: any;
  loadingState: 'loading' | 'loaded' | 'error' = 'loading';

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      birthDate: ['', Validators.required],
      weight: [0, Validators.required],
      petId: [''],
      ownerId: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.petId = +id;
      this.loadPetDetails(this.petId);
    }
  }

  loadPetDetails(id: number): void {
    this.loadingState = 'loading';

    this.petService.getPetDetails(id).subscribe({
      next: (data) => {
        this.petDetails = data;
        this.form.patchValue({
          name: data.name,
          species: data.species,
          breed: data.breed,
          birthDate: Helpers.formatDateForInput(data.birthDate),
          weight: data.weight,
          petId: data.petId,
          ownerId: data.owner?.ownerId
        });
        
        this.loadingState = 'loaded';
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.loadingState = 'error';
      }
    });
  }
  
  saveEditChanges(): void {
    if (this.form.invalid) return;

    this.loadingState = 'loading';

    const dto = {
      ...this.form.value
    }

    this.petService.updatePet(this.form.value.petId, dto).subscribe({
      next: (data) => {
        this.toastService.success(`Pet ${dto.name} updated successfully!`);
        this.petDetails = data;
        this.loadingState = 'loaded';
      },
      error: (err) => {
      this.toastService.error(err.error.message);
        console.log(err);
        this.loadingState = 'error';
      }
    });
  }

  viewOwnerDetails(id: number): void {
    this.router.navigate(['owners/details', id]);
  }
}
