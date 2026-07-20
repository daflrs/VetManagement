import { ChangeDetectorRef, Component } from '@angular/core';
import { OwnerService } from '../../services/owner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { ConfirmModal } from '../../common/confirm-modal/confirm-modal';
import { PageLayout } from '../../common/page-layout/page-layout';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-owner-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmModal, PageLayout],
  templateUrl: './owner-details.html',
  styleUrl: './owner-details.css',
})
export class OwnerDetails {

  ownerForm: any;
  ownerId: number | null = null;
  petIdToRemove: number | null = null;
  petNameToRemove: string | null = null;
  ownerDetails: any;
  pets: any[] = [];
  selectedPets: any[] = [];
  showAddPetDropdown: boolean = false;
  showAddPetToOwnerSelector: boolean = false;
  petsLoaded: boolean = false;
  showRemovePetModal: boolean = false;
  isRemovingPet: boolean = false;
  loadingState: 'loading' | 'loaded' | 'error' = 'loading';
  isSavingOwner: boolean = false;
  isLoadingOwner: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ownerService: OwnerService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ownerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.ownerId = +id;
      this.loadOwnerDetails(this.ownerId);
    }
  }

  loadOwnerDetails(id: number): void {
    this.isLoadingOwner = true;

    this.ownerService.getOwnerDetails(id).subscribe({
      next: (data) => {
        this.ownerDetails = data;
        this.ownerForm.patchValue({
          firstName: this.ownerDetails.firstName,
          lastName: this.ownerDetails.lastName,
          phoneNumber: this.ownerDetails.phoneNumber,
          email: this.ownerDetails.email,
          address: this.ownerDetails.address
        });
        this.isLoadingOwner = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isLoadingOwner = false;
      }
    });
  }

  saveEditChanges(): void {
    if (this.ownerForm.invalid) return;

    this.isSavingOwner = true;

    const dto = {
      ...this.ownerForm.value
    }

    this.ownerService.updateOwner(Number(this.ownerId), dto).subscribe({
      next: (data) => {
        this.toastService.success(`Owner ${dto.firstName} ${dto.lastName} updated successfully!`);
        this.ownerDetails = data;
        this.ownerForm.markAsPristine();
        this.isSavingOwner = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isSavingOwner = false;
      }
    });
  }

  viewPetDetails(id: number): void {
    this.router.navigate(['pets/details', id]);
  }

  loadPets(): void {
    this.loadingState = 'loading';
    console.log(this.selectedPets)

    this.ownerService.getPetsAvailableForOwner().subscribe({
      next: (data) => {
        this.pets = data;
        this.petsLoaded = true;
        this.loadingState = 'loaded';
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  addNewPetFromOwner(ownerId: number): void {
    this.router.navigate(['/create-pet'], {
      queryParams: { ownerId: ownerId }
    });
  }

  addPetsToOwner(): void {
    if (this.ownerId === null) {
      this.toastService.error('Owner ID is missing.');
      return;
    }

    this.loadingState = 'loading';

    const petIds = this.selectedPets.map(s => s.petId);

    this.ownerService.addPetsToOwner(this.ownerId, petIds).subscribe({
      next: (data) => {
        this.selectedPets = [];
        this.showAddPetDropdown = false;
        this.pets = [];
        this.petsLoaded = false;
        this.ownerDetails = data;
        this.loadingState = 'loaded';
        console.log(data)
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.loadingState = 'error';
      }});
  }

  togglePetSelector(): void {
    this.showAddPetToOwnerSelector = !this.showAddPetToOwnerSelector;
  }

  toggleDropdown(): void {
    this.showAddPetDropdown = !this.showAddPetDropdown;

    if (!this.petsLoaded && this.showAddPetDropdown) {
      this.loadPets();
    }
  }
  
  get availablePets(): any[] {
    return this.pets.filter(p =>
      !this.selectedPets.some(s => s.petId === p.petId)
    );
  }

  get canAssignPets(): boolean {
    return this.selectedPets.length > 0
      && this.loadingState !== 'loading';
  }

  removePet(event: MouseEvent, petId: number): void {
    event.stopPropagation();
    this.selectedPets = this.selectedPets.filter(s => s.petId !== petId);
  }

  selectPet(pet: any): void {
    const exists = this.selectedPets.some(p => p.petId == pet.petId);

    if (!exists) {
      this.selectedPets.push(pet);
    }
  }
  
  openRemovePetModal(event: MouseEvent, petId: number, petName: string): void {
    event.stopPropagation();
    this.petIdToRemove = petId;
    this.petNameToRemove = petName;
    this.showRemovePetModal = true;
  }

  cancelRemovePet(): void {
    this.showRemovePetModal = false;
  }

  removePetFromOwner(): void {
    if (this.petIdToRemove === null) return;

    this.isRemovingPet = true;

    this.ownerService.removePetFromOwner(Number(this.ownerId), this.petIdToRemove).subscribe({
      next: (data) => {
        this.toastService.success(`Pet successfully removed.`);
        this.ownerDetails = data;
        this.petIdToRemove = null;
        this.isRemovingPet = false;
        this.showRemovePetModal = false;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
        console.log(err);
        this.isRemovingPet = false;
      }
    });
  }

}
