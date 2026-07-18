import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { PetService } from '../../services/pet.service';
import { BackButton } from '../../common/back-button/back-button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Helpers } from '../../common/helpers';
import { ConfirmModal } from '../../common/confirm-modal/confirm-modal';

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButton, ConfirmModal],
  templateUrl: './pet-details.html',
  styleUrl: './pet-details.css',
})
export class PetDetails {

  petForm: any;
  ownerForm: any;
  petId: number | null = null;
  petDetails: any;
  owners: any[] = [];
  showSelectOwnerSelector: boolean = false;
  isAssigningOwner: boolean = false;
  isLoadingOwner: boolean = false;
  isSavingPet: boolean = false;
  isLoadingPet: boolean = false;
  showRemoveOwnerModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      birthDate: ['', Validators.required],
      weight: [0, Validators.required],
      petId: ['']
    });

    this.ownerForm = this.fb.group({
      ownerId: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.petId = +id;
      this.loadPetDetails(this.petId);
    }
  }

  loadPetDetails(id: number): void {
    this.isLoadingPet = true;

    this.petService.getPetDetails(id).subscribe({
      next: (data) => {
        this.petDetails = data;
        this.petForm.patchValue({
          name: this.petDetails.name,
          species: this.petDetails.species,
          breed: this.petDetails.breed,
          birthDate: Helpers.formatDateForInput(this.petDetails.birthDate),
          weight: this.petDetails.weight,
          petId: this.petDetails.petId
        });
        
        this.isLoadingPet = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isLoadingPet = false;
      }
    });
  }
  
  loadOwners(): void {
    this.isLoadingOwner = true;
    
    this.petService.getOwners().subscribe({
      next: (data) => {
        this.owners = data;
        this.ownerForm.patchValue({
          ownerId: this.petDetails.owner?.ownerId ?? ''
        });

        this.isLoadingOwner = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.error(err);
        this.isLoadingOwner = false;
      }
    });
  }
  
  saveEditChanges(): void {
    if (this.petForm.invalid) return;

    this.isSavingPet = true;

    const dto = {
      ...this.petForm.value
    }

    this.petService.updatePet(this.petForm.value.petId, dto).subscribe({
      next: (data) => {
        this.toastService.success(`Pet ${dto.name} updated successfully!`);
        this.petDetails = data;
        this.petForm.markAsPristine();
        this.isSavingPet = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSavingPet = false;
      }
    });
  }

  openAssignOwner(event: MouseEvent): void {
    event.stopPropagation();
    this.showSelectOwnerSelector = true;
    this.loadOwners();
  }

  closeAssignOwner(event: MouseEvent): void {
    event.stopPropagation();
    this.ownerForm.patchValue({ ownerId: null });
    this.showSelectOwnerSelector = false;
    this.loadOwners();
  }

  viewOwnerDetails(id: number): void {
    if (this.showSelectOwnerSelector) return;
    
    this.router.navigate(['owners/details', id]);
  }
  
  updateOwner(): void {
    this.isAssigningOwner = true;

    this.petService.updateOwner(Number(this.petId), this.ownerForm.value.ownerId).subscribe({
      next: (data) => {
        this.toastService.success(`Pet owner updated successfully!`);
        this.petDetails = data;
        this.ownerForm.patchValue({ ownerId: null });
        this.isAssigningOwner = false;
        this.showSelectOwnerSelector = false;
      },
      error: (err) => {
        this.toastService.warning(err.error.message);
        console.log(err);
        this.isAssigningOwner = false;
      }
    });
  }
  
  get petHasNoOwner(): boolean {
    return this.petDetails.owner === null;
  }

  openRemoveOwnerModal(event: MouseEvent): void {
    event.stopPropagation();
    this.showRemoveOwnerModal = true;
  }

  cancelRemoveOwner(): void {
    this.showRemoveOwnerModal = false;
  }

  removeOwner(): void {
    this.isAssigningOwner = true;

    this.petService.removeOwner(Number(this.petId)).subscribe({
      next: (data) => {
        this.toastService.success(`Owner successfully unassigned.`);
        this.petDetails = data;
        this.ownerForm.patchValue({ ownerId: null });
        this.isAssigningOwner = false;
        this.showSelectOwnerSelector = false;
        this.showRemoveOwnerModal = false;
      },
      error: (err) => {
        this.toastService.warning(err.error.message);
        console.log(err);
        this.isAssigningOwner = false;
      }
    });
  }
}
